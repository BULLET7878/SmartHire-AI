const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, getResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Resume routes
router.post('/upload', protect, authorize('USER'), upload.single('resume'), asyncHandler(uploadResume));
router.get('/mine', protect, authorize('USER'), asyncHandler(getResume));

module.exports = router;
