const { groq } = require('../config/gemini');
const { generateAnalysisPrompt } = require('../utils/promptTemplate');

/**
 * Truncate text to fit within token limits
 * Rough estimate: 1 token ≈ 4 characters
 * Keep first 20,000 chars (~5,000 tokens) to stay well within free tier limits
 */
const truncateText = (text, maxChars = 20000) => {
    if (text.length <= maxChars) return text;
    console.log(`⚠️ Document text truncated from ${text.length} to ${maxChars} chars`);
    return text.slice(0, maxChars) + '\n\n[... Document truncated for analysis ...]';
};

/**
 * Analyze a financial document using Groq AI (free tier)
 * @param {string} documentText - Extracted text from the document
 * @param {string} documentType - Type of document
 * @returns {Promise<Object>} Structured analysis result
 */
const analyzeDocument = async (documentText, documentType) => {
    try {
        const trimmedText = truncateText(documentText);
        const prompt = generateAnalysisPrompt(trimmedText, documentType);

        console.log('🤖 Calling Groq AI (Llama 3.1 8B)...');
        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: 'You are a financial document analysis expert. Always respond with valid JSON only, no extra text or markdown code blocks.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 4096,
        });

        let text = completion.choices[0].message.content.trim();
        console.log('✅ Groq response received');

        // Clean the response - remove markdown code blocks if present
        if (text.startsWith('```json')) {
            text = text.slice(7);
        } else if (text.startsWith('```')) {
            text = text.slice(3);
        }
        if (text.endsWith('```')) {
            text = text.slice(0, -3);
        }
        text = text.trim();

        // Parse JSON response
        const analysis = JSON.parse(text);
        console.log('✅ Analysis parsed successfully');

        // Validate and provide defaults for required fields
        return {
            summary: analysis.documentSummary || 'Analysis completed but no summary was generated.',
            financialBreakdown: analysis.financialBreakdown || {},
            hiddenCharges: Array.isArray(analysis.hiddenCharges) ? analysis.hiddenCharges : [],
            riskAlerts: Array.isArray(analysis.riskAlerts) ? analysis.riskAlerts : [],
            repaymentData: Array.isArray(analysis.repaymentData) ? analysis.repaymentData : [],
            insuranceInsights: analysis.insuranceInsights || null,
            loanInsights: analysis.loanInsights || null,
            recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
        };
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Failed to parse AI response. The AI did not return valid JSON.');
        }
        throw new Error(`AI Analysis failed: ${error.message}`);
    }
};

module.exports = { analyzeDocument };
