const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Rejected', 'Review Later'],
        default: 'Applied'
    },
    resumeUrl: {
        type: String, // Store the resume filename/path
        required: false
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
