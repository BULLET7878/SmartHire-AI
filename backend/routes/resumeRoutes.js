const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, getResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
    }
});

const upload = multer({ storage: storage });

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Resume routes
router.post('/upload', protect, authorize('USER'), upload.single('resume'), asyncHandler(uploadResume));
router.get('/mine', protect, authorize('USER'), asyncHandler(getResume));

module.exports = router;
