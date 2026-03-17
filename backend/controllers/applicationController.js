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

        // Auto-match against job description
        try {
            const Resume = require('../models/Resume');
            const MatchResult = require('../models/MatchResult');
            const { calculateMatchInsight } = require('../utils/geminiUtil');

            // Find latest resume for this user
            const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });

            if (resume) {
                // Calculate Score using Gemini
                const result = await calculateMatchInsight(resume, job.description || job.title);

                if (result) {
                    await MatchResult.findOneAndUpdate(
                        { resumeId: resume._id, jobId: job._id },
                        {
                            score: result.score,
                            subScores: result.subScores,
                            justification: result.justification,
                            missingSkills: result.missingSkills,
                            matchedKeywords: result.matched_keywords,
                            status: result.score >= 75 ? 'Strong Match' : result.score >= 40 ? 'Medium Match' : 'Weak Match'
                        },
                        { upsert: true, new: true }
                    );
                }
            }
        } catch (matchErr) {
            console.error("Auto-match failed:", matchErr);
        }

        // Create application
        const application = await Application.create({
            user: userId,
            job: jobId,
            resumeUrl,
            status: 'Applied',
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

        if (!isRecruiter) {
            console.warn(`Denied: Recruiter ${req.user._id} attempted to access applicants for Job ${jobId} owned by ${job.postedBy}`);
            return res.status(403).json({ message: 'Access denied: You do not own this job posting' });
        }

        // Get applications with user details
        const applications = await Application.find({ job: jobId })
            .populate('user', 'name email role resumePath')
            .sort({ appliedAt: -1 });

        const validApplications = applications.filter(app => app.user);

        // Fetch candidate resumes
        const userIds = validApplications.map(app => app.user._id);
        const Resume = require('../models/Resume');
        const MatchResult = require('../models/MatchResult');

        // Map user ID to their latest resume
        const resumeMap = {}; // userId -> latest Resume
        const resumeIds = [];

        allResumes.forEach(r => {
            if (!resumeMap[r.userId.toString()]) {
                resumeMap[r.userId.toString()] = r;
                resumeIds.push(r._id);
            }
        });

        // Fetch ATS match results
        const allMatches = await MatchResult.find({ resumeId: { $in: resumeIds }, jobId: jobId });
        const matchMap = {}; // resumeId -> MatchResult
        allMatches.forEach(m => {
            matchMap[m.resumeId.toString()] = m;
        });

        const enrichedApplications = validApplications.map((app) => {
            const data = app.toObject();
            const resume = resumeMap[app.user._id.toString()];

            if (resume) {
                const match = matchMap[resume._id.toString()];
                data.matchScore = match ? match.score : 0;
                data.matchStatus = match ? match.status : 'Weak Match';
                data.justification = match ? match.justification : '';
                data.subScores = match ? match.subScores : null;
                data.missingSkills = match ? match.missingSkills : [];
                data.matchedKeywords = match ? match.matchedKeywords : [];
                data.aiSummary = resume.aiSummary || '';
                data.user.skills = resume.skills || [];
                data.resumeMeta = resume.metadata;
            } else {
                data.matchScore = 0;
            }

            if (!isRecruiter) {
                delete data.user.resumePath;
                delete data.resumeUrl;
            }
            return data;
        });

        // Rank by highest match score
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

        let matchMap = {};
        if (resume && applications.length > 0) {
            const jobIds = applications.filter(a => a.job).map(a => a.job._id);
            const matches = await MatchResult.find({ resumeId: resume._id, jobId: { $in: jobIds } });
            matches.forEach(m => {
                matchMap[m.jobId.toString()] = m;
            });
        }

        const output = applications.map((app) => {
            const data = app.toObject();
            if (resume && app.job) {
                const match = matchMap[app.job._id.toString()];
                if (match) {
                    data.matchScore = match.score;
                    data.matchStatus = match.status;
                    data.subScores = match.subScores;
                    data.justification = match.justification;
                    data.missingSkills = match.missingSkills;
                    data.matchedKeywords = match.matchedKeywords;
                } else {
                    data.matchScore = 0;
                }
            } else {
                data.matchScore = 0;
            }
            return data;
        });

        // Generate summary statistics
        const totalApplications = output.length;
        const validScores = output.map(app => app.matchScore).filter(score => score && score > 0);
        const averageScore = validScores.length > 0 
            ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) 
            : 0;
        
        const shortlistedCount = output.filter(app => ['Shortlisted', 'Interviewed', 'Accepted'].includes(app.status)).length;

        // Calculate profile strength estimation
        let profileStrength = 0;
        if (resume) {
            if (resume.metadata?.hasExperience) profileStrength += 25;
            if (resume.metadata?.hasEducation) profileStrength += 25;
            if (resume.metadata?.hasProjects) profileStrength += 25;
            if (resume.skills && resume.skills.length >= 5) profileStrength += 25;
        }

        res.json({
            applications: output,
            summary: {
                totalApplications,
                averageScore,
                shortlistedCount,
                profileStrength
            }
        });
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

        // Use aggregation to count statuses efficiently without transferring full docs to memory
        const stats = await Application.aggregate([
            { $match: { job: { $in: jobIds } } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get resumes to match and calculate average score
        const MatchResult = require('../models/MatchResult');
        const matches = await MatchResult.find({ jobId: { $in: jobIds } });
        
        const validScores = matches.map(m => m.score).filter(s => s > 0);
        const averageScore = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
        const topCandidates = validScores.filter(s => s >= 80).length;

        let totalApplied = 0;
        let shortlisted = 0;
        let rejected = 0;
        let reviewed = 0;

        stats.forEach(stat => {
            totalApplied += stat.count;
            if (['Shortlisted', 'Interviewed', 'Accepted'].includes(stat._id)) shortlisted += stat.count;
            if (stat._id === 'Rejected') rejected += stat.count;
            if (['Reviewed', 'Review Later'].includes(stat._id)) reviewed += stat.count;
        });

        res.json({
            totalApplied,
            shortlisted,
            rejected,
            reviewed,
            totalJobs: jobs.length,
            averageScore,
            topCandidates
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
        const { calculateMatchInsight } = require('../utils/geminiUtil');

        const resume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        if (!resume) return res.status(404).json({ message: 'No resume found' });

        const result = await calculateMatchInsight(resume, job.description || job.title);

        if (result) {
            await MatchResult.findOneAndUpdate(
                { resumeId: resume._id, jobId: job._id },
                {
                    score: result.score,
                    subScores: result.subScores,
                    justification: result.justification,
                    missingSkills: result.missingSkills,
                    status: result.score >= 75 ? 'Strong Match' : result.score >= 40 ? 'Medium Match' : 'Weak Match'
                },
                { upsert: true, new: true }
            );
        }

        res.json(result);
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
