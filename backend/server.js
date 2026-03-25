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
    console.error('   → Go to Railway dashboard → your service → Variables tab and add them.');
    process.exit(1); // Crash early so Railway shows the error clearly
}
console.log('✅ All required environment variables are present.');

// Connect to database
// Connect to database
connectDB();

const app = express();
const jwt = require('jsonwebtoken');

// Trust proxy headers (needed for Railway/Render/Vercel deployments)
app.set('trust proxy', 1);

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

// Static file serving is handled by Netlify when deployed as a serverless function.
// Only serve locally during development.
if (process.env.NODE_ENV !== 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

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

