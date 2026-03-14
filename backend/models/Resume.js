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
    aiSummary: {
        type: String
    },
    skills: [{
        type: String
    }],
    experience: [{
        role: String,
        company: String,
        duration: String,
        description: String
    }],
    education: [{
        degree: String,
        institution: String,
        year: String
    }],
    projects: [{
        name: String,
        description: String,
        technologies: [String]
    }],
    embeddings: {
        type: [Number] // For semantic similarity
    },
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
