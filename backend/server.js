const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// ── Startup Environment Validation ──────────────────────────────────────────
const REQUIRED_ENV_VARS = ['MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];
const missingVars = REQUIRED_ENV_VARS.filter(v => !process.env[v]);
if (missingVars.length > 0) {
    console.error('❌ MISSING REQUIRED ENVIRONMENT VARIABLES:', missingVars.join(', '));
    console.error('   → Go to Netlify/Railway dashboard → your service → Variables tab and add them.');
}
console.log('✅ All required environment variables are present.');

// The DB will connect via middleware instead of eagerly at startup

const app = express();
const jwt = require('jsonwebtoken');

// Trust proxy headers (needed for Railway/Render/Vercel deployments)
app.set('trust proxy', 1);

// Serverless DB Connection Middleware
app.use((req, res, next) => {
    connectDB()
        .then(() => next())
        .catch((err) => next(err));
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fix for Netlify Serverless where req.body arrives as a raw Buffer
app.use((req, res, next) => {
    if (Buffer.isBuffer(req.body)) {
        try {
            req.body = JSON.parse(req.body.toString('utf8'));
        } catch (e) {
            console.error('Failed to parse Buffer body', e);
        }
    }
    next();
});
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes (to be imported)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/demo', require('./routes/demoRoutes'));

// Secure File Serving - always available for JD and resume files
const fs = require('fs');
app.get('/uploads/:filename', (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(401).json({ message: "Not authorized, no token provided" });
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        const filePath = path.join(__dirname, 'uploads', req.params.filename);
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });
        if (filePath.endsWith('.pdf')) {
            res.setHeader('Content-Disposition', 'inline');
            res.setHeader('Content-Type', 'application/pdf');
        }
        res.sendFile(filePath);
    } catch (error) {
        res.status(401).json({ message: "Not authorized, invalid or expired token" });
    }
});

// Error handling middleware (placeholder)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Only start the HTTP server when running directly (not as a serverless function)
if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

module.exports = app;

