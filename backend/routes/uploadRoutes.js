const express = require('express');
const router = express.Router();
const { upload, uploadDocument } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/upload – Upload a PDF document (protected)
router.post('/', protect, upload.single('document'), uploadDocument);

module.exports = router;
