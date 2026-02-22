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

// Apply to a job
router.post('/:jobId', protect, applyToJob);

// Update status (recruiter only)
router.put('/:id/status', protect, updateApplicationStatus);

// Get job's applications (recruiter only)
router.get('/job/:jobId', protect, getJobApplications);

// Get my applications
router.get('/my', protect, getMyApplications);

// Check if applied to job
router.get('/check/:jobId', protect, checkApplication);

// Get recruiter global stats
router.get('/pulse', protect, getPulse);

// Get match insight for a job
router.get('/insight/:jobId', protect, getMatchInsight);

module.exports = router;
