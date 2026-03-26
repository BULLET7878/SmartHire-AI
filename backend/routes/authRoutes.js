const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLoginUser } = require('../controllers/authController');

// Async route wrapper for Express 4
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.post('/google', asyncHandler(googleLoginUser));

module.exports = router;
