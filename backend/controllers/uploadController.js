const path = require('path');
const multer = require('multer');
const Document = require('../models/Document');
const { extractTextFromPDF, formatFileSize } = require('../services/pdfService');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

// File filter – only allow PDFs
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

// Multer upload instance
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/**
 * @desc    Upload a PDF document, extract text, save metadata
 * @route   POST /api/upload
 * @access  Private
 */
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded. Please upload a PDF file.',
            });
        }

        const { documentType } = req.body;

        // Extract text from the uploaded PDF
        let extractedText = '';
        try {
            extractedText = await extractTextFromPDF(req.file.path);
        } catch (pdfError) {
            console.error('PDF extraction error:', pdfError.message);
            // Still save the document but mark the issue
        }

        // Save document metadata to database
        const document = await Document.create({
            userId: req.user._id,
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileSize: formatFileSize(req.file.size),
            documentType: documentType || 'other',
            extractedText,
            status: extractedText ? 'processing' : 'error',
        });

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            data: {
                documentId: document._id,
                fileName: document.fileName,
                fileSize: document.fileSize,
                documentType: document.documentType,
                status: document.status,
                uploadedAt: document.uploadedAt,
            },
        });
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during file upload',
        });
    }
};

module.exports = { upload, uploadDocument };
