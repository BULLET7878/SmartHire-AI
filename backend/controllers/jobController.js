const Job = require('../models/Job');
const Application = require('../models/Application');

const listAll = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
        const output = await Promise.all(
            jobs.map(async (job) => {
                const count = await Application.countDocuments({ job: job._id });
                return { ...job.toObject(), applicantCount: count };
            })
        );
        res.json(output);
    } catch (err) {
        console.error("ListAll Error:", err);
        res.status(500).json({ message: "Search failed" });
    }
};

const listMine = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
        const output = await Promise.all(
            jobs.map(async (job) => {
                const count = await Application.countDocuments({ job: job._id });
                return { ...job.toObject(), applicantCount: count };
            })
        );
        res.json(output);
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

module.exports = {
    getJobs: listAll,
    getMyJobs: listMine,
    createJob: create,
    updateJob: update,
    deleteJob: remove,
    toggleJobStatus: toggleStatus
};
