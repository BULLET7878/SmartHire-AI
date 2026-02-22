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
    missingSkills: [{
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
