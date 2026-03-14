const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    fileName: {
        type: String,
        required: [true, 'File name is required'],
        trim: true,
    },
    filePath: {
        type: String,
        required: [true, 'File path is required'],
    },
    fileSize: {
        type: String,
        default: '0 KB',
    },
    documentType: {
        type: String,
        enum: ['insurance_policy', 'loan_agreement', 'credit_card_terms', 'mortgage_document', 'other'],
        default: 'other',
    },
    extractedText: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'analyzed', 'error'],
        default: 'pending',
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Document', documentSchema);
