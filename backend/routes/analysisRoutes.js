const express = require('express');
const router = express.Router();
const { getAnalysis, getInsuranceInsights, getLoanInsights } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/analysis/:documentId – Get full AI analysis
router.get('/:documentId', protect, getAnalysis);

// GET /api/insurance/:documentId – Get insurance insights
// Note: Mounted at /api/insurance in server.js
// We export as a separate router to keep it clean
// But the controller is shared with analysis

module.exports = router;
