const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Wrap async routes to handle errors if not using express-async-handler
// For simplicity in this demo, I will assume standard error handling catch or manual try-catch in controller.
// In authController I used throw new Error but Express 4 doesn't catch async errors automatically without a wrapper.
// I will wrap them here simply or use a utility.
// Actually, for "Clean controller logic", I should probably use express-async-handler but I didn't install it.
// I will wrap them inline or just rely on the fact that I should add try-catch in controller.
// Re-visiting controller: I used throw new Error. This will crash the server in async functions in Express 4 if not handled.
// I will update the controller to use try-catch or install express-async-handler.
// Let's stick to try-catch in the controller for valid Express 4 behavior without extra libs, OR simpler:
// I'll install express-async-handler. It's standard.

// Wait, I can't install new deps easily without `npm install`.
// I'll just use a simple wrapper function here.

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));

module.exports = router;
