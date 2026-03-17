const express = require('express');
const router = express.Router();
const { analyzeDemo } = require('../controllers/demoController');

// POST /api/demo/analyze
router.post('/analyze', analyzeDemo);

module.exports = router;
