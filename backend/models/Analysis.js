const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
        unique: true,
        index: true,
    },
    summary: {
        type: String,
        default: '',
    },
    financialBreakdown: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        // Expected shape:
        // { annualPremium, deductible, coverageLimit, monthlyPayment }
        // or for loans: { principalAmount, totalInterest, totalRepayment }
    },
    hiddenCharges: {
        type: [
            {
                name: String,
                amount: Number,
                description: String,
            },
        ],
        default: [],
    },
    riskAlerts: {
        type: [
            {
                severity: {
                    type: String,
                    enum: ['low', 'medium', 'high'],
                },
                title: String,
                description: String,
            },
        ],
        default: [],
    },
    repaymentData: {
        type: [
            {
                year: String,
                principal: Number,
                interest: Number,
            },
        ],
        default: [],
    },
    insuranceInsights: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
        // Expected shape:
        // { premium, coverage, waitingPeriod, coPayPercentage, policyDuration,
        //   clarityScore, exclusions, claimConditions, coverageDetails }
    },
    loanInsights: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
        // Expected shape:
        // { interestRate, emiAmount, totalRepayment, loanDuration, principalAmount,
        //   totalInterest, emiSchedule, principalVsInterest, riskAlerts }
    },
    recommendations: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Analysis', analysisSchema);
