const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['USER', 'RECRUITER', 'ADMIN'],
        default: 'USER'
    },
    resumePath: {
        type: String,
        default: ''
    },
    company: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
