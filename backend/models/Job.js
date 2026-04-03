const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    requiredSkills: [{
        type: String
    }],
    experienceLevel: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String, // e.g. "Remote", "New York, NY"
        required: true
    },
    stipend: {
        type: String, // e.g. "$5000/mo" or "Unpaid"
        required: true
    },
    jobType: {
        type: String, // "Full-time", "Internship", "Contract"
        default: "Full-time"
    },
    duration: {
        type: String, // e.g. "6 months" - Only relevant for internships/contracts
        required: false
    },
    joiningMonth: {
        type: String, // e.g. "January 2026" or "Immediate"
        required: false
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Closed'],
        default: 'Active'
    },
    description: {
        type: String,
        required: false
    },
    jdPath: {
        type: String,
        required: false
    },
    jdText: {
        type: String,
        required: false
    },
    jdFileData: {
        type: Buffer,
        required: false
    },
    jdFileType: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
