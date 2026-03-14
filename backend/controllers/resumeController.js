const Resume = require('../models/Resume');
const User = require('../models/User');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const { analyzeResume, getEmbeddings } = require('../utils/geminiUtil');

const handleUpload = async (req, res) => {
    console.log("--- New Resume Upload Attempt ---");
    if (!req.file) {
        console.warn("Upload failed: No file provided");
        return res.status(400).json({ message: "No file provided" });
    }
    console.log(`File received: ${req.file.originalname} (${req.file.mimetype})`);

    try {
        let text = "";
        const buffer = fs.readFileSync(req.file.path);
        console.log(`Starting extraction for ${req.file.originalname} (${req.file.size} bytes)...`);

        try {
            if (req.file.originalname.toLowerCase().endsWith('.pdf')) {
                try {
                    console.log("Parsing PDF with pdf-parse...");
                    const data = await pdf(buffer);
                    text = data.text;
                    console.log("PDF parsed successfully.");
                } catch (pdfErr) {
                    console.error("pdf-parse failed, falling back to buffer string:", pdfErr.message);
                    text = buffer.toString('utf8'); // Fallback for low-quality/dummy PDFs
                }
            } else if (req.file.originalname.toLowerCase().endsWith('.docx')) {
                const result = await mammoth.extractRawText({ buffer });
                text = result.value;
                console.log("DOCX parsed successfully.");
            } else {
                console.warn("Unsupported file format:", req.file.originalname);
                return res.status(400).json({ message: "Unsupported file format. Use PDF or DOCX." });
            }
        } catch (extractErr) {
            console.error("Extraction helper failed:", extractErr.message);
            throw new Error(`Text extraction failed: ${extractErr.message}`);
        }

        console.log(`Extracted text length: ${text.length} characters`);

        // --- ADVANCED ANALYSIS ---
        console.log("Starting Advanced Analysis...");
        const aiData = await analyzeResume(text);
        console.log("Analysis Result:", aiData ? "SUCCESS" : "FAILED");

        if (!aiData || aiData.isResume === false) {
            console.warn(`Upload Blocked: ${aiData?.reason || "Document is not a valid resume/CV."}`);
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                message: aiData?.reason || "This document does not look like a resume. Please upload a valid Resume/CV."
            });
        }

        console.log("Generating Embeddings...");
        const embeddings = await getEmbeddings(text);
        console.log("Embeddings generated:", embeddings ? "SUCCESS" : "FAILED");

        try {
            // Update user profile link
            console.log("Updating User resumePath...");
            await User.findByIdAndUpdate(req.user._id, {
                resumePath: req.file.filename
            });

            const filter = { userId: req.user._id };
            const update = {
                rawText: text,
                aiSummary: aiData.summary || "No summary provided",
                skills: aiData.skills || [],
                experience: aiData.experience || [],
                education: aiData.education || [],
                projects: aiData.projects || [],
                embeddings: embeddings || [],
                metadata: {
                    hasExperience: !!(aiData.experience && aiData.experience.length > 0),
                    hasEducation: !!(aiData.education && aiData.education.length > 0),
                    hasProjects: !!(aiData.projects && aiData.projects.length > 0),
                    experienceKeywords: (text.match(/years|months/gi) || []).length
                }
            };

            console.log("Saving/Updating Resume record in DB...");
            let doc = await Resume.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true,
                runValidators: true
            });
            console.log("Resume record saved successfully ID:", doc._id);
            res.status(201).json(doc);
        } catch (dbErr) {
            console.error("Database Persistence Error:", dbErr);
            throw dbErr; // Re-throw to be caught by main catch block
        }
    } catch (err) {
        console.error("CRITICAL Resume Processing Error:", err.message);
        console.error(err.stack);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "Analysis failed" });
    }
};

const getResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: "No profile found" });
        }
        res.json(resume);
    } catch (err) {
        res.status(500).json({ message: "Fetch failed" });
    }
};

module.exports = {
    uploadResume: handleUpload,
    getResume
};
