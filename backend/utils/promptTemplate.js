/**
 * Generate the AI analysis prompt for financial document analysis.
 * The prompt instructs Gemini to return structured JSON matching frontend data shapes.
 *
 * @param {string} documentText - Extracted text from the document
 * @param {string} documentType - Type of document (insurance_policy, loan_agreement, etc.)
 * @returns {string} The formatted prompt
 */
const generateAnalysisPrompt = (documentText, documentType) => {
    return `You are FinGuardian, an expert AI financial contract analyst. Analyze the following financial document and provide a comprehensive structured analysis.

Document Type: ${documentType}
Document Content:
---
${documentText}
---

Analyze this document thoroughly and return a JSON response with the following structure. Be precise with numbers and provide actionable insights.

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks, no extra text.

{
  "documentSummary": "A clear, plain-English summary of what this document is about, its key terms, and what the user should know (2-4 sentences)",

  "financialBreakdown": {
    "annualPremium": <number or 0 if not applicable>,
    "deductible": <number or 0>,
    "coverageLimit": <number or 0>,
    "monthlyPayment": <number or 0>,
    "totalCost": <number or 0>,
    "interestRate": <number or 0>
  },

  "hiddenCharges": [
    {
      "name": "<charge name>",
      "amount": <estimated amount as number>,
      "description": "<what this charge is and when it applies>"
    }
  ],

  "riskAlerts": [
    {
      "severity": "<high|medium|low>",
      "title": "<short risk title>",
      "description": "<detailed explanation of the risk and what user should do>"
    }
  ],

  "repaymentData": [
    {
      "year": "Year 1",
      "principal": <number>,
      "interest": <number>
    }
  ],

  "insuranceInsights": ${documentType === 'insurance_policy' ? `{
    "premium": <annual premium number>,
    "coverage": <total coverage amount number>,
    "waitingPeriod": "<waiting period as string, e.g. '30 days'>",
    "coPayPercentage": <co-pay percentage number>,
    "policyDuration": "<policy duration as string, e.g. '12 months'>",
    "clarityScore": <score from 0-100 indicating how clear the policy language is>,
    "exclusions": ["<list of things NOT covered>"],
    "claimConditions": ["<list of conditions required to make a claim>"],
    "coverageDetails": [
      {
        "category": "<coverage category name>",
        "limit": <coverage limit number>,
        "deductible": <deductible number>
      }
    ]
  }` : 'null'},

  "loanInsights": ${documentType === 'loan_agreement' || documentType === 'mortgage_document' ? `{
    "interestRate": <annual interest rate number>,
    "emiAmount": <monthly EMI amount number>,
    "totalRepayment": <total amount to be repaid number>,
    "loanDuration": <loan duration in months number>,
    "principalAmount": <original loan amount number>,
    "totalInterest": <total interest over loan duration number>,
    "emiSchedule": [
      {
        "month": "<e.g. Month 1>",
        "emi": <EMI amount number>,
        "principal": <principal portion number>,
        "interest": <interest portion number>,
        "balance": <remaining balance number>
      }
    ],
    "principalVsInterest": [
      {
        "year": "<e.g. Year 1>",
        "principal": <total principal paid that year number>,
        "interest": <total interest paid that year number>
      }
    ],
    "riskAlerts": [
      {
        "severity": "<high|medium|low>",
        "title": "<risk title>",
        "description": "<risk description>"
      }
    ]
  }` : 'null'},

  "recommendations": [
    "<actionable recommendation for the user based on analysis>"
  ]
}

Guidelines:
- If a field is not applicable to this document type, use the default (0 for numbers, empty array [], null for objects).
- For insurance documents, focus on insuranceInsights. For loan/mortgage documents, focus on loanInsights.
- Identify ALL hidden charges, fees, and penalties mentioned in the document.
- Rate risks as "high" (potentially costly or dangerous), "medium" (worth noting), or "low" (minor concern).
- Provide at least 3 recommendations.
- For EMI schedules, provide entries at key milestones (Month 1, 6, 12, 24, 36, etc.).
- The clarity score should reflect how easy the document language is to understand (100 = very clear, 0 = very complex).
- All monetary values should be numbers without currency symbols.`;
};

module.exports = { generateAnalysisPrompt };
