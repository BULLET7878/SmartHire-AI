const Job = require('../models/Job');
const Application = require('../models/Application');

const listAll = async (req, res) => {
    try {
        const jobs = await Job.aggregate([
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'job',
                    as: 'applications'
                }
            },
            {
                $addFields: {
                    applicantCount: { $size: "$applications" }
                }
            },
            {
                $project: {
                    applications: 0 // Remove the large array from response
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        // We need to populate postedBy since aggregate doesn't do it automatically like .find()
        const populatedJobs = await Job.populate(jobs, { path: 'postedBy', select: 'name email' });

        res.json(populatedJobs);
    } catch (err) {
        console.error("ListAll Error:", err);
        res.status(500).json({ message: "Search failed" });
    }
};

const listMine = async (req, res) => {
    try {
        const jobs = await Job.aggregate([
            {
                $match: { postedBy: req.user._id }
            },
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'job',
                    as: 'applications'
                }
            },
            {
                $addFields: {
                    applicantCount: { $size: "$applications" }
                }
            },
            {
                $project: {
                    applications: 0
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json(jobs);
    } catch (err) {
        console.error("ListMine Error:", err);
        res.status(500).json({ message: "Fetch failed" });
    }
};

const create = async (req, res) => {
    try {
        if (!req.body) {
            console.error("No body received in createJob");
            return res.status(400).json({ message: "Payload missing" });
        }

        let { title, requiredSkills, experienceLevel, company, location, stipend, jobType, duration, joiningMonth } = req.body;

        // Parse skills if string (happens with multipart)
        if (typeof requiredSkills === 'string') {
            try {
                requiredSkills = JSON.parse(requiredSkills);
            } catch (e) {
                requiredSkills = requiredSkills.split(',').map(s => s.trim());
            }
        }

        const entry = await Job.create({
            title,
            requiredSkills: requiredSkills || [],
            experienceLevel: experienceLevel || 'Mid',
            company,
            location,
            stipend,
            jobType: jobType || 'Full-time',
            duration,
            joiningMonth,
            jdPath: req.file ? req.file.filename : null,
            postedBy: req.user._id
        });

        res.status(201).json(entry);
    } catch (err) {
        console.error("Job Create Error:", err);
        res.status(400).json({ message: err.message || "Save failed" });
    }
};

const update = async (req, res) => {
    try {
        const target = await Job.findById(req.params.id);
        if (!target) return res.status(404).json({ message: "Not found" });

        if (target.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (!req.body) {
            return res.status(400).json({ message: "Update payload missing" });
        }

        let updateData = { ...req.body };
        if (req.file) {
            updateData.jdPath = req.file.filename;
        }

        // Parse skills if string
        if (typeof updateData.requiredSkills === 'string') {
            try {
                updateData.requiredSkills = JSON.parse(updateData.requiredSkills);
            } catch (e) {
                updateData.requiredSkills = updateData.requiredSkills.split(',').map(s => s.trim());
            }
        }

        const fresh = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(fresh);
    } catch (err) {
        console.error("Job Update Error:", err);
        res.status(400).json({ message: "Update failed" });
    }
};

const toggleStatus = async (req, res) => {
    try {
        const target = await Job.findById(req.params.id);
        if (!target) return res.status(404).json({ message: "Not found" });

        if (target.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        target.status = target.status === 'Active' ? 'Closed' : 'Active';
        await target.save();
        res.json(target);
    } catch (err) {
        res.status(400).json({ message: "Toggle failed" });
    }
};

const remove = async (req, res) => {
    try {
        const target = await Job.findById(req.params.id);
        if (!target) return res.status(404).json({ message: "Not found" });

        if (target.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        await target.deleteOne();
        res.json({ message: "Removed" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
};

const reEvaluateAts = async (req, res) => {
    try {
        const target = await Job.findById(req.params.id);
        if (!target) return res.status(404).json({ message: "Not found" });

        if (target.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        const applications = await Application.find({ job: target._id });
        if (applications.length === 0) {
            return res.json({ message: "No applications to re-evaluate" });
        }

        const Resume = require('../models/Resume');
        const MatchResult = require('../models/MatchResult');
        const { calculateMatchInsight } = require('../utils/geminiUtil');

        // Re-evaluate in parallel for faster processing
        await Promise.all(applications.map(async (app) => {
            const resume = await Resume.findOne({ userId: app.user }).sort({ createdAt: -1 });
            if (resume) {
                const result = await calculateMatchInsight(resume, target.description || target.title);
                if (result) {
                    await MatchResult.findOneAndUpdate(
                        { resumeId: resume._id, jobId: target._id },
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
            }
        }));

        res.json({ message: "Re-evaluation complete" });
    } catch (err) {
        console.error("Re-evaluation Error:", err);
        res.status(500).json({ message: "Re-evaluation failed" });
    }
};

module.exports = {
    getJobs: listAll,
    getMyJobs: listMine,
    createJob: create,
    updateJob: update,
    deleteJob: remove,
    toggleJobStatus: toggleStatus,
    reEvaluateAts
};
