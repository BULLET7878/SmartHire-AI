const { analyzeResume, calculateMatchInsight } = require('../utils/geminiUtil');

// Simple in-memory rate limiting for the demo endpoint
// Key: IP, Value: { count: Number, resetTime: Number }
const rateLimitCache = {};
const MAX_REQUESTS = 2;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

const analyzeDemo = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        const clientIp = req.ip || req.connection.remoteAddress;

        // Rate Limiter
        const now = Date.now();
        if (!rateLimitCache[clientIp]) {
            rateLimitCache[clientIp] = { count: 1, resetTime: now + WINDOW_MS };
        } else {
            const record = rateLimitCache[clientIp];
            if (now > record.resetTime) {
                // Reset window
                record.count = 1;
                record.resetTime = now + WINDOW_MS;
            } else {
                record.count += 1;
                if (record.count > MAX_REQUESTS) {
                    return res.status(429).json({ 
                        message: "Demo limit reached. Please register to use the full application." 
                    });
                }
            }
        }

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ message: "Both resume text and job description are required for the demo." });
        }

        // 1. Analyze the raw resume text into structured data
        const resumeData = await analyzeResume(resumeText);
        
        if (!resumeData || !resumeData.isResume) {
             return res.status(400).json({ 
                message: resumeData?.reason || "Could not parse a valid resume from the provided text." 
            });
        }

        // 2. Perform deep matching against the Job Description
        const matchInsight = await calculateMatchInsight(resumeData, jobDescription);

        // Map the result to our expected demo structure
        const responseData = {
            score: matchInsight.score || 0,
            matched_skills: matchInsight.matched_keywords || matchInsight.matchedKeywords || [],
            missing_skills: matchInsight.missingSkills || matchInsight.missing_keywords || [],
            suggestions: matchInsight.improvements || (matchInsight.justification ? [matchInsight.justification] : []),
            status: matchInsight.status || "Evaluated",
            subScores: matchInsight.subScores || null,
            strengths: matchInsight.strengths || [],
            improvements: matchInsight.improvements || []
        };

        return res.json(responseData);
    } catch (err) {
        console.error("Demo Analysis Error:", err);
        return res.status(500).json({ message: "An error occurred during demo analysis." });
    }
};

module.exports = {
    analyzeDemo
};
