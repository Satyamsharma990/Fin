const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const { protect } = require('./middleware/authMiddleware');
const { getInsuranceInsights, getLoanInsights } = require('./controllers/analysisController');

// Import routes
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const documentRoutes = require('./routes/documentRoutes');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/documents', documentRoutes);

// Insurance and Loan insight routes (mounted separately as per spec)
app.get('/api/insurance/:documentId', protect, getInsuranceInsights);
app.get('/api/loan/:documentId', protect, getLoanInsights);

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'FinGuardian Backend API is running',
        timestamp: new Date().toISOString(),
    });
});

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File too large. Maximum file size is 10MB.',
        });
    }

    if (err.message === 'Only PDF files are allowed') {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
});

// ─── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 FinGuardian Backend Server running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Auth:   http://localhost:${PORT}/api/auth`);
    console.log(`   Upload: http://localhost:${PORT}/api/upload`);
    console.log(`   Docs:   http://localhost:${PORT}/api/documents\n`);
});
