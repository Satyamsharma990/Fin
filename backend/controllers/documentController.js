const Document = require('../models/Document');
const Analysis = require('../models/Analysis');

/**
 * @desc    Get all documents for the logged-in user
 * @route   GET /api/documents
 * @access  Private
 */
const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ userId: req.user._id })
            .select('-extractedText') // Don't return full text in list view
            .sort({ uploadedAt: -1 });

        const documentList = documents.map((doc) => ({
            id: doc._id,
            name: doc.fileName,
            type: doc.documentType,
            uploadDate: doc.uploadedAt,
            status: doc.status,
            fileSize: doc.fileSize,
        }));

        res.json({
            success: true,
            count: documentList.length,
            data: documentList,
        });
    } catch (error) {
        console.error('Get documents error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error fetching documents',
        });
    }
};

/**
 * @desc    Get a single document by ID
 * @route   GET /api/documents/:id
 * @access  Private
 */
const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).select('-extractedText');

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found',
            });
        }

        res.json({
            success: true,
            data: {
                id: document._id,
                name: document.fileName,
                type: document.documentType,
                uploadDate: document.uploadedAt,
                status: document.status,
                fileSize: document.fileSize,
                filePath: document.filePath,
            },
        });
    } catch (error) {
        console.error('Get document error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error fetching document',
        });
    }
};

/**
 * @desc    Delete a document and its associated analysis
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found',
            });
        }

        // Delete associated analysis
        await Analysis.findOneAndDelete({ documentId: document._id });

        // Delete the document record
        await Document.findByIdAndDelete(document._id);

        // Try to delete the file from disk
        const fs = require('fs');
        try {
            if (fs.existsSync(document.filePath)) {
                fs.unlinkSync(document.filePath);
            }
        } catch (fileError) {
            console.warn('Could not delete file from disk:', fileError.message);
        }

        res.json({
            success: true,
            message: 'Document and analysis deleted successfully',
        });
    } catch (error) {
        console.error('Delete document error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error deleting document',
        });
    }
};

/**
 * @desc    Get dashboard statistics for the logged-in user
 * @route   GET /api/documents/stats
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Count total documents analyzed
        const documentsAnalyzed = await Document.countDocuments({
            userId,
            status: 'analyzed',
        });

        // Get all analyses for this user's documents
        const userDocIds = await Document.find({ userId }).select('_id');
        const docIds = userDocIds.map((d) => d._id);

        const analyses = await Analysis.find({ documentId: { $in: docIds } });

        // Calculate aggregate stats
        let hiddenChargesDetected = 0;
        let riskyClauses = 0;
        let totalHiddenChargeAmount = 0;

        analyses.forEach((analysis) => {
            hiddenChargesDetected += (analysis.hiddenCharges || []).length;
            riskyClauses += (analysis.riskAlerts || []).length;
            (analysis.hiddenCharges || []).forEach((charge) => {
                totalHiddenChargeAmount += charge.amount || 0;
            });
        });

        res.json({
            success: true,
            data: {
                documentsAnalyzed,
                hiddenChargesDetected,
                riskyClauses,
                moneySaved: totalHiddenChargeAmount, // Potential savings by knowing about hidden charges
            },
        });
    } catch (error) {
        console.error('Dashboard stats error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error fetching dashboard stats',
        });
    }
};

module.exports = { getDocuments, getDocumentById, deleteDocument, getDashboardStats };
