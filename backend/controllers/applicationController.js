const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (User only)
const applyToJob = async (req, res) => {
    console.log("HIT: applyToJob", req.params.jobId, req.user._id);
    try {
        const { jobId } = req.params;
        const userId = req.user._id;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({ user: userId, job: jobId });
        if (existingApplication) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }

        // Get user's resume path from their profile (if available)
        const resumeUrl = req.user.resumePath || '';

        // --- AUTOMATIC MATCHING LOGIC ---
        // Wrapped in try-catch to ensure application processing doesn't fail if matching has an issue
        try {
            const Resume = require('../models/Resume');
            const MatchResult = require('../models/MatchResult');
            const calculateMatchScore = require('../utils/matchUtil');

            // Find latest resume for this user
            const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });

            // Calculate Score
            const matchResult = calculateMatchScore(resume, job);

            // Save Match Result
            if (resume) {
                await MatchResult.findOneAndUpdate(
                    { resumeId: resume._id, jobId: job._id },
                    {
                        score: matchResult.score,
                        missingSkills: matchResult.missingSkills,
                        status: matchResult.status
                    },
                    { upsert: true, new: true }
                );
            }
        } catch (matchErr) {
            console.error("Auto-match failed:", matchErr);
            // Continue to create application even if match fails
        }

        // Create application
        const application = await Application.create({
            user: userId,
            job: jobId,
            resumeUrl,
            status: 'Applied',
            // We could store score on application too for faster lookup, 
            // but for now we'll join via MatchResult or just rely on the separate calc
        });

        res.status(201).json(application);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications for a specific job (for recruiters)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only - must own the job)
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Verify job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const isRecruiter = job.postedBy.toString() === req.user._id.toString();

        // Get applications with user details
        const applications = await Application.find({ job: jobId })
            .populate('user', 'name email role resumePath')
            .sort({ appliedAt: -1 });

        // Fetch match results for each applicant to show scores to recruiter
        const Resume = require('../models/Resume');
        const MatchResult = require('../models/MatchResult');
        const calculateMatchScore = require('../utils/matchUtil');

        // Create regex filter for valid applications
        const validApplications = applications.filter(app => app.user);

        const enrichedApplications = await Promise.all(validApplications.map(async (app) => {
            const data = app.toObject();

            // Safe to access app.user._id now
            const resume = await Resume.findOne({ userId: app.user._id }).sort({ createdAt: -1 });

            let matchScore = 0;
            let matchStatus = 'Weak Match';
            let missingSkills = [];

            if (resume) {
                // Try to find existing match result
                let match = await MatchResult.findOne({ resumeId: resume._id, jobId: jobId });

                // If not found (legacy data), calculate it now
                if (!match) {
                    const result = calculateMatchScore(resume, job);
                    matchScore = result.score;
                    matchStatus = result.status;
                    missingSkills = result.missingSkills;
                } else {
                    matchScore = match.score;
                    matchStatus = match.status;
                    missingSkills = match.missingSkills;
                }

                // Inject skills for frontend (User model doesn't have it, Resume does)
                if (data.user) {
                    data.user.skills = resume.skills || [];
                }
            }

            data.matchScore = matchScore;
            data.matchStatus = matchStatus;

            // Allow frontend to see what skills are missing according to ATS
            if (matchStatus !== 'Weak Match' && resume) {
                data.missingSkills = missingSkills || [];
            }

            // Inject Metadata for Recruiter ATS Analysis
            if (resume && resume.metadata) {
                data.resumeMeta = resume.metadata;
            }

            if (!isRecruiter) {
                delete data.user.resumePath;
                delete data.resumeUrl;
            }
            return data;
        }));

        // Rank by match score (highest first)
        const ranked = enrichedApplications.sort((a, b) => b.matchScore - a.matchScore);

        res.json(ranked);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's own applications
// @route   GET /api/applications/my
// @access  Private
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user._id })
            .populate('job')
            .sort({ appliedAt: -1 });

        // Enrich with match scores
        const Resume = require('../models/Resume');
        const MatchResult = require('../models/MatchResult');

        const resume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

        const output = await Promise.all(applications.map(async (app) => {
            const data = app.toObject();
            if (resume && app.job) {
                const match = await MatchResult.findOne({ resumeId: resume._id, jobId: app.job._id });
                data.matchScore = match ? match.score : 0;
            }
            return data;
        }));

        res.json(output);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if user has applied to a job
// @route   GET /api/applications/check/:jobId
// @access  Private
const checkApplication = async (req, res) => {
    try {
        const { jobId } = req.params;
        const application = await Application.findOne({
            user: req.user._id,
            job: jobId
        });

        res.json({ hasApplied: !!application, application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status (Recruiter only)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await Application.findById(id).populate('job');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if requester owns the job
        if (application.job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPulse = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id });
        const jobIds = jobs.map(j => j._id);
        const applications = await Application.find({ job: { $in: jobIds } });

        res.json({
            totalApplied: applications.length,
            shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
            rejected: applications.filter(a => a.status === 'Rejected').length,
            reviewed: applications.filter(a => ['Reviewed', 'Review Later'].includes(a.status)).length,
            totalJobs: jobs.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMatchInsight = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const Resume = require('../models/Resume');
        const MatchResult = require('../models/MatchResult');
        const calculateMatchScore = require('../utils/matchUtil');

        const resume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        if (!resume) return res.status(404).json({ message: 'No resume found' });

        const result = calculateMatchScore(resume, job);

        await MatchResult.findOneAndUpdate(
            { resumeId: resume._id, jobId: job._id },
            {
                score: result.score,
                missingSkills: result.missingSkills,
                status: result.status
            },
            { upsert: true, new: true }
        );

        res.json({
            score: result.score,
            status: result.status,
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills
        });
    } catch (error) {
        res.status(500).json({ message: "Insight failed" });
    }
};

module.exports = {
    applyToJob,
    getJobApplications,
    getMyApplications,
    checkApplication,
    updateApplicationStatus,
    getPulse,
    getMatchInsight
};
