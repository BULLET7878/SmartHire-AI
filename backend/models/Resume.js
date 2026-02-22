const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rawText: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }],
    metadata: {
        hasExperience: { type: Boolean, default: false },
        hasEducation: { type: Boolean, default: false },
        hasProjects: { type: Boolean, default: false },
        experienceKeywords: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
