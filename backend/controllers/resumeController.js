const Resume = require('../models/Resume');
const User = require('../models/User');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

const handleUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
    }

    try {
        let text = "";
        const buffer = fs.readFileSync(req.file.path);

        if (req.file.originalname.toLowerCase().endsWith('.pdf')) {
            const data = await pdf(buffer);
            text = data.text;
        } else if (req.file.originalname.toLowerCase().endsWith('.docx')) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            return res.status(400).json({ message: "Unsupported file format. Use PDF or DOCX." });
        }

        const skillsDict = [
            'JavaScript', 'Node.js', 'React', 'MongoDB', 'Express', 'Python', 'Java', 'C++', 'SQL', 'AWS',
            'Docker', 'TypeScript', 'Tailwind', 'Redux', 'Git', 'Machine Learning', 'AI', 'NLP', 'TensorFlow',
            'Django', 'Flask', 'Spring Boot', 'Kubernetes', 'GCP', 'Azure', 'Linux'
        ];

        const foundSkills = skillsDict.filter(skill =>
            new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)
        );

        // Basic Structured Data Extraction (Regex based)
        const hasExperience = /experience|work history|employment|internship/i.test(text);
        const hasEducation = /education|university|college|bachelors|masters/i.test(text);
        const hasProjects = /projects|portfolio|personal projects/i.test(text);

        // Update user profile link
        await User.findByIdAndUpdate(req.user._id, {
            resumePath: req.file.filename
        });

        const filter = { userId: req.user._id };
        const update = {
            rawText: text,
            skills: foundSkills,
            metadata: {
                hasExperience,
                hasEducation,
                hasProjects,
                experienceKeywords: (text.match(/years|months/gi) || []).length
            }
        };

        let doc = await Resume.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        });

        res.status(201).json(doc);
    } catch (err) {
        console.error("Resume Processing Error:", err);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "Analysis failed" });
    }
};

module.exports = { uploadResume: handleUpload };
