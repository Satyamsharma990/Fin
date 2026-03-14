const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * Extract text content from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} Extracted text content
 */
const extractTextFromPDF = async (filePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(fileBuffer);

        if (!pdfData.text || pdfData.text.trim().length === 0) {
            throw new Error('No text content found in the PDF document');
        }

        return pdfData.text.trim();
    } catch (error) {
        if (error.message.includes('No text content')) {
            throw error;
        }
        throw new Error(`Failed to parse PDF: ${error.message}`);
    }
};

/**
 * Format file size from bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

module.exports = { extractTextFromPDF, formatFileSize };
