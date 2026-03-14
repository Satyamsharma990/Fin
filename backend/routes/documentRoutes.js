const express = require('express');
const router = express.Router();
const { getDocuments, getDocumentById, deleteDocument, getDashboardStats } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/documents/stats – Dashboard stats (must come before /:id to avoid conflicts)
router.get('/stats', protect, getDashboardStats);

// GET /api/documents – List all documents for user
router.get('/', protect, getDocuments);

// GET /api/documents/:id – Get single document
router.get('/:id', protect, getDocumentById);

// DELETE /api/documents/:id – Delete document
router.delete('/:id', protect, deleteDocument);

module.exports = router;
