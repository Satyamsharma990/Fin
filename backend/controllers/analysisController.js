const Document = require('../models/Document');
const Analysis = require('../models/Analysis');
const { analyzeDocument } = require('../services/aiService');

/**
 * @desc    Get or trigger AI analysis for a document
 * @route   GET /api/analysis/:documentId
 * @access  Private
 */
const getAnalysis = async (req, res) => {
    try {
        const { documentId } = req.params;

        // Find the document
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found',
            });
        }

        // Check if analysis already exists
        let analysis = await Analysis.findOne({ documentId: document._id });

        if (analysis) {
            return res.json({
                success: true,
                data: {
                    documentId: document._id,
                    documentName: document.fileName,
                    summary: analysis.summary,
                    financialBreakdown: analysis.financialBreakdown,
                    hiddenCharges: analysis.hiddenCharges,
                    riskAlerts: analysis.riskAlerts,
                    repaymentData: analysis.repaymentData,
                    insuranceInsights: analysis.insuranceInsights,
                    loanInsights: analysis.loanInsights,
                    recommendations: analysis.recommendations,
                    createdAt: analysis.createdAt,
                },
            });
        }

        // No existing analysis — run AI analysis
        if (!document.extractedText) {
            return res.status(400).json({
                success: false,
                message: 'No text could be extracted from this document. Please upload a valid PDF.',
            });
        }

        // Update document status to processing
        document.status = 'processing';
        await document.save();

        // Run AI analysis
        const aiResult = await analyzeDocument(document.extractedText, document.documentType);

        // Save analysis to database
        analysis = await Analysis.create({
            documentId: document._id,
            summary: aiResult.summary,
            financialBreakdown: aiResult.financialBreakdown,
            hiddenCharges: aiResult.hiddenCharges,
            riskAlerts: aiResult.riskAlerts,
            repaymentData: aiResult.repaymentData,
            insuranceInsights: aiResult.insuranceInsights,
            loanInsights: aiResult.loanInsights,
            recommendations: aiResult.recommendations,
        });

        // Update document status
        document.status = 'analyzed';
        await document.save();

        res.json({
            success: true,
            data: {
                documentId: document._id,
                documentName: document.fileName,
                summary: analysis.summary,
                financialBreakdown: analysis.financialBreakdown,
                hiddenCharges: analysis.hiddenCharges,
                riskAlerts: analysis.riskAlerts,
                repaymentData: analysis.repaymentData,
                insuranceInsights: analysis.insuranceInsights,
                loanInsights: analysis.loanInsights,
                recommendations: analysis.recommendations,
                createdAt: analysis.createdAt,
            },
        });
    } catch (error) {
        console.error('Analysis error:', error.message);

        // Update document status to error if it exists
        try {
            await Document.findByIdAndUpdate(req.params.documentId, { status: 'error' });
        } catch (_) { }

        res.status(500).json({
            success: false,
            message: `Analysis failed: ${error.message}`,
        });
    }
};

/**
 * @desc    Get insurance-specific insights for a document
 * @route   GET /api/insurance/:documentId
 * @access  Private
 */
const getInsuranceInsights = async (req, res) => {
    try {
        const { documentId } = req.params;

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found',
            });
        }

        let analysis = await Analysis.findOne({ documentId: document._id });

        // If no analysis exists, trigger one
        if (!analysis) {
            if (!document.extractedText) {
                return res.status(400).json({
                    success: false,
                    message: 'No text extracted from this document',
                });
            }

            const aiResult = await analyzeDocument(document.extractedText, document.documentType);
            analysis = await Analysis.create({
                documentId: document._id,
                ...aiResult,
            });
            document.status = 'analyzed';
            await document.save();
        }

        if (!analysis.insuranceInsights) {
            return res.status(404).json({
                success: false,
                message: 'No insurance insights available for this document. It may not be an insurance policy.',
            });
        }

        res.json({
            success: true,
            data: analysis.insuranceInsights,
        });
    } catch (error) {
        console.error('Insurance insights error:', error.message);
        res.status(500).json({
            success: false,
            message: `Failed to get insurance insights: ${error.message}`,
        });
    }
};

/**
 * @desc    Get loan-specific insights for a document
 * @route   GET /api/loan/:documentId
 * @access  Private
 */
const getLoanInsights = async (req, res) => {
    try {
        const { documentId } = req.params;

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found',
            });
        }

        let analysis = await Analysis.findOne({ documentId: document._id });

        // If no analysis exists, trigger one
        if (!analysis) {
            if (!document.extractedText) {
                return res.status(400).json({
                    success: false,
                    message: 'No text extracted from this document',
                });
            }

            const aiResult = await analyzeDocument(document.extractedText, document.documentType);
            analysis = await Analysis.create({
                documentId: document._id,
                ...aiResult,
            });
            document.status = 'analyzed';
            await document.save();
        }

        if (!analysis.loanInsights) {
            return res.status(404).json({
                success: false,
                message: 'No loan insights available for this document. It may not be a loan agreement.',
            });
        }

        res.json({
            success: true,
            data: analysis.loanInsights,
        });
    } catch (error) {
        console.error('Loan insights error:', error.message);
        res.status(500).json({
            success: false,
            message: `Failed to get loan insights: ${error.message}`,
        });
    }
};

module.exports = { getAnalysis, getInsuranceInsights, getLoanInsights };
