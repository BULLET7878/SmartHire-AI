const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createJob, getJobs, getMyJobs, updateJob, deleteJob, toggleJobStatus, reEvaluateAts } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Job routes
router.post('/', protect, authorize('RECRUITER'), upload.single('jdFile'), asyncHandler(createJob));
router.get('/', protect, asyncHandler(getJobs));
router.get('/my', protect, authorize('RECRUITER'), asyncHandler(getMyJobs));
router.put('/:id', protect, authorize('RECRUITER'), upload.single('jdFile'), asyncHandler(updateJob));
router.delete('/:id', protect, authorize('RECRUITER'), asyncHandler(deleteJob));
router.put('/:id/toggle', protect, authorize('RECRUITER'), asyncHandler(toggleJobStatus));
router.post('/:id/re-evaluate', protect, authorize('RECRUITER'), asyncHandler(reEvaluateAts));

module.exports = router;
