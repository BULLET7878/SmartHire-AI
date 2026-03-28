const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    applyToJob,
    getJobApplications,
    getMyApplications,
    checkApplication,
    updateApplicationStatus,
    getPulse,
    getMatchInsight
} = require('../controllers/applicationController');

// Async route wrapper for Express 4
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Apply to a job
router.post('/:jobId', protect, asyncHandler(applyToJob));

// Update status (recruiter only)
router.put('/:id/status', protect, asyncHandler(updateApplicationStatus));

// Get job's applications (recruiter only)
router.get('/job/:jobId', protect, asyncHandler(getJobApplications));

// Get my applications
router.get('/my', protect, asyncHandler(getMyApplications));

// Check if applied to job
router.get('/check/:jobId', protect, asyncHandler(checkApplication));

// Get recruiter global stats
router.get('/pulse', protect, asyncHandler(getPulse));

// Get match insight for a job
router.get('/insight/:jobId', protect, asyncHandler(getMatchInsight));

module.exports = router;
