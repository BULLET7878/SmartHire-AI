const mongoose = require('mongoose');

const matchResultSchema = mongoose.Schema({
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    subScores: {
        skills: { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
        projects: { type: Number, default: 0 },
        education: { type: Number, default: 0 }
    },
    justification: {
        type: String
    },
    missingSkills: [{
        type: String
    }],
    matchedKeywords: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['Strong Match', 'Medium Match', 'Weak Match'],
        default: 'Weak Match'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MatchResult', matchResultSchema);
