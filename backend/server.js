const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// ── Startup Environment Validation ──────────────────────────────────────────
const REQUIRED_ENV_VARS = ['MONGODB_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Serve Frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));
// Secure File Serving Middleware
app.get('/uploads/:filename', (req, res) => {
    const { token } = req.query;
    
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        
        const filePath = path.join(__dirname, 'uploads', req.params.filename);
        if (filePath.endsWith('.pdf')) {
            res.setHeader('Content-Disposition', 'inline');
            res.setHeader('Content-Type', 'application/pdf');
        }
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(404).json({ message: "File not found" });
            }
        });
    } catch (error) {
        res.status(401).json({ message: "Not authorized, invalid or expired token" });
    }
});

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
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

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on 0.0.0.0:${PORT}`);
    });
}

module.exports = app;

