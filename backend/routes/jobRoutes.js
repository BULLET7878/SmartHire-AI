const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createJob, getJobs, getMyJobs, updateJob, deleteJob, toggleJobStatus, reEvaluateAts } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Memory storage — file stored in MongoDB as Buffer
const upload = multer({ storage: multer.memoryStorage() });

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/', protect, authorize('RECRUITER'), upload.single('jdFile'), asyncHandler(createJob));
router.get('/', protect, asyncHandler(getJobs));
router.get('/my', protect, authorize('RECRUITER'), asyncHandler(getMyJobs));
router.put('/:id', protect, authorize('RECRUITER'), upload.single('jdFile'), asyncHandler(updateJob));
router.delete('/:id', protect, authorize('RECRUITER'), asyncHandler(deleteJob));
router.put('/:id/toggle', protect, authorize('RECRUITER'), asyncHandler(toggleJobStatus));
router.post('/:id/re-evaluate', protect, authorize('RECRUITER'), asyncHandler(reEvaluateAts));

// Serve JD file directly from MongoDB
router.get('/:id/jd', protect, asyncHandler(async (req, res) => {
    const Job = require('../models/Job');
    const job = await Job.findById(req.params.id);
    if (!job || !job.jdFileData) return res.status(404).json({ message: 'JD file not found' });
    res.setHeader('Content-Type', job.jdFileType || 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.send(job.jdFileData);
}));

module.exports = router;
