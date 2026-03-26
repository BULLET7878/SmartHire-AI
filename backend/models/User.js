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
        required: false // Optional for users logging in via Google
    },
    googleId: {
        type: String,
        required: false,
        unique: true,
        sparse: true // Allows multiple null/undefined googleIds
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
