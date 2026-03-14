const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Gemini with the API KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "PLACEHOLDER_KEY");

const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

/**
 * Heuristic check to see if a document is a resume or a financial statement
 */
function localIsResumeCheck(text) {
    const lowerText = text.toLowerCase();

    // Financial indicator words
    const financialWords = ['statement of account', 'transaction date', 'available balance', 'current balance', 'debit', 'credit', 'invoice', 'billing date', 'account number', 'payment due'];
    let financialScore = 0;
    financialWords.forEach(word => {
        if (lowerText.includes(word)) financialScore += 2;
    });

    // Resume indicator words
    const resumeWords = ['experience', 'education', 'skills', 'projects', 'languages', 'certifications', 'summary', 'profile', 'employment', 'work history'];
    let resumeScore = 0;
    resumeWords.forEach(word => {
        if (lowerText.includes(word)) resumeScore += 1;
    });

    if (financialScore > 3 && financialScore > resumeScore) {
        return { isResume: false, reason: "Financial document detected (Statement/Invoice)." };
    }

    if (resumeScore < 1 && text.length < 500) {
        return { isResume: false, reason: "Document too short or missing professional headers." };
    }

    return { isResume: true };
}

/**
 * Local extraction of skills using NLP when Gemini is unavailable
 */
function localAnalyzeResume(text) {
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const commonSkills = [
        // Frontend & UI
        'javascript', 'react', 'vue', 'angular', 'html', 'css', 'tailwind', 'sass', 'figma', 'ui', 'ux', 'typescript', 'nextjs', 'svelte',
        // Backend & DB
        'node', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'sql', 'mysql', 'postgres', 'mongodb', 'express', 'django', 'spring', 'flask',
        // DevOps & Cloud
        'git', 'aws', 'docker', 'kubernetes', 'azure', 'gcp', 'linux', 'ci/cd', 'terraform', 'jenkins',
        // Data & ML
        'pandas', 'numpy', 'tensorflow', 'pytorch', 'machine learning', 'data analysis', 'excel', 'tableau',
        // General / Soft
        'agile', 'scrum', 'leadership', 'communication', 'management', 'marketing', 'sales', 'strategy', 'design', 'research'
    ];
    const foundSkills = [...new Set(tokens.filter(t => commonSkills.includes(t)))];
    const lowerText = text.toLowerCase();

    // Very basic heuristic to check if sections exist
    const hasEducation = /education|university|college|degree|bachelor|master/i.test(lowerText);
    const hasProjects = /project|repository|github|portfolio/i.test(lowerText);
    const hasExperience = /experience|work history|employment|job|role|responsibilities/i.test(lowerText);

    return {
        isResume: true,
        reason: "Basic keyword extraction complete",
        skills: foundSkills.map(s => s.toUpperCase()),
        summary: `Basic analysis detected ${foundSkills.length} skills. Model insights restricted.`,
        experience: hasExperience ? [{ role: "Detected via Keyword Analysis" }] : [],
        education: hasEducation ? [{ degree: "Detected via Keyword Analysis" }] : [],
        projects: hasProjects ? [{ name: "Detected via Keyword Analysis" }] : []
    };
}

/**
 * Parses raw resume text into structured JSON using Gemini Pro.
 * Strictly validates if the text is a resume.
 */
async function analyzeResume(text) {
    // 1. First, do a local heuristic check to block obvious non-resumes immediately
    const localCheck = localIsResumeCheck(text);
    if (!localCheck.isResume) {
        console.warn(`Local Rejection: ${localCheck.reason}`);
        return localCheck;
    }

    // 2. Check for Gemini API Key
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_key_here' && process.env.GEMINI_API_KEY !== 'PLACEHOLDER_KEY';

    if (!hasKey) {
        console.log("Using Local NLP Fallback (Gemini Key Missing)");
        return localAnalyzeResume(text);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const systemPrompt = `
            You are an AI Resume Parser used in a professional ATS system.

            Your task is to analyze the provided document and determine if it is a professional resume or CV.

            STRICT VALIDATION RULES
        1. If the document is a bank statement, invoice, bill, financial record, or transaction log, set "isResume" to false.
            2. If the text is a news article, random text, or a book excerpt, set "isResume" to false.
            3. A valid resume must contain a name and at least TWO of the following sections:
        - Skills
            - Experience
            - Education
            - Projects
            - Contact Information

            If the document is not a resume, return:

        {
            "isResume": false,
                "reason": "Explain why the document is not a resume"
        }

            If it is a resume, extract the information and return JSON in this format:

        {
            "isResume": true,
                "summary": "Professional summary of the candidate",
                    "skills": {
                "languages": [],
                    "frameworks": [],
                        "databases": [],
                            "tools": [],
                                "cloud": [],
                                    "other": []
            },
            "experience": [
                {
                    "role": "",
                    "company": "",
                    "duration": "",
                    "description": ""
                }
            ],
                "education": [
                    {
                        "degree": "",
                        "institution": "",
                        "year": ""
                    }
                ],
                    "projects": [
                        {
                            "name": "",
                            "description": "",
                            "technologies": []
                        }
                    ]
        }

        IMPORTANT
            Return only JSON.
            Do not include markdown.
            Do not include explanations outside JSON.
        `;

        const result = await model.generateContent([
            systemPrompt,
            "Resume Text:",
            text
        ]);

        const response = await result.response;
        let jsonText = response.text().replace(/```json | ```/g, "").trim();
        const parsed = JSON.parse(jsonText);

        // Flatten skills object to array
        let flatSkills = [];
        if (parsed.skills && typeof parsed.skills === 'object' && !Array.isArray(parsed.skills)) {
            Object.values(parsed.skills).forEach(arr => {
                if (Array.isArray(arr)) flatSkills = flatSkills.concat(arr);
            });
        } else if (Array.isArray(parsed.skills)) {
            flatSkills = parsed.skills;
        }

        // Map the user's prompt output to the exact names expected by the frontend
        return {
            ...parsed,
            skills: flatSkills,
            missingSkills: parsed.missing_keywords || []
        };
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        // Fallback to local on API error
        return localAnalyzeResume(text);
    }
}

/**
 * Generates vector embeddings for a given text
 */
async function getEmbeddings(text) {
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_key_here' && process.env.GEMINI_API_KEY !== 'PLACEHOLDER_KEY';
    if (!hasKey) return Array(768).fill(0); // Mock embedding for local mode

    try {
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error("Gemini Embedding Error:", error.message);
        return Array(768).fill(0);
    }
}

/**
 * Performs deep matching between a resume and job description
 */
async function calculateMatchInsight(resumeData, jobDescription) {
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_key_here' && process.env.GEMINI_API_KEY !== 'PLACEHOLDER_KEY';

    if (!hasKey) {
        // Fallback: Perform basic local string matching if Gemini is missing
        const natural = require('natural');
        const tokenizer = new natural.WordTokenizer();

        // Extract basic keywords
        const resumeTokens = new Set(tokenizer.tokenize(JSON.stringify(resumeData).toLowerCase()));
        const jdTokens = new Set(tokenizer.tokenize(jobDescription.toLowerCase()));

        const resumeSkills = resumeData.skills && Array.isArray(resumeData.skills) ? resumeData.skills : [];
        const requiredSkills = resumeData._jobRequiredSkills || []; // We'll assume we can optionally pass this or just rely on JD

        // If no skills are defined anywhere, try to salvage from description
        const commonTech = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'html', 'css', 'typescript', 'mongodb', 'express', 'git', 'agile', 'linux', 'c++', 'c#', 'php', 'ruby', 'go', 'rust'];
        const allPotentialSkills = [...new Set([...resumeSkills, ...requiredSkills, ...commonTech])];

        const matchedKeywords = [];
        const missingSkills = [];

        // Dynamic scoring against JD
        allPotentialSkills.forEach(skill => {
            const skillLower = skill.toLowerCase();
            // If the job mentions it
            if (jdTokens.has(skillLower) || jobDescription.toLowerCase().includes(skillLower)) {
                // Check if user has it
                if (resumeTokens.has(skillLower) || resumeSkills.some(rs => rs.toLowerCase().includes(skillLower))) {
                    if (!matchedKeywords.includes(skill)) matchedKeywords.push(skill);
                } else {
                    if (!missingSkills.includes(skill)) missingSkills.push(skill);
                }
            } else if (requiredSkills.some(rs => rs.toLowerCase() === skillLower)) {
                // Even if not directly in JD string, if it was explicitly a required skill
                if (resumeTokens.has(skillLower) || resumeSkills.some(rs => rs.toLowerCase().includes(skillLower))) {
                    if (!matchedKeywords.includes(skill)) matchedKeywords.push(skill);
                } else {
                    if (!missingSkills.includes(skill)) missingSkills.push(skill);
                }
            }
        });

        const totalRelevant = matchedKeywords.length + missingSkills.length;
        let score = 0; // Base score starts at 0 for strict evaluation
        let dynamicJustification = "Basic keyword analysis completed. ";

        if (totalRelevant > 0) {
            const matchRatio = matchedKeywords.length / totalRelevant;
            score = Math.floor(matchRatio * 100);

            if (score >= 75) {
                dynamicJustification += `Strong alignment found with key requirements like ${matchedKeywords.slice(0, 2).join(' and ')}.`;
            } else if (score >= 40) {
                dynamicJustification += `Moderate match. You have some required skills but are missing ${missingSkills.slice(0, 2).join(' and ')}.`;
            } else {
                dynamicJustification += `Weak match. Consider highlighting skills like ${missingSkills.slice(0, 3).join(', ')} if you have them.`;
            }
        } else {
            // NLP similarity scoring if no clear keywords
            const similarity = natural.JaroWinklerDistance(JSON.stringify(resumeData).toLowerCase(), jobDescription.toLowerCase());
            score = Math.floor(similarity * 100);
            dynamicJustification += `Score derived from general text similarity (${score}%). No specific technical keywords were extracted directly.`;
        }

        return {
            score: score,
            status: score >= 75 ? "Strong Match" : score >= 40 ? "Medium Match" : "Weak Match",
            justification: dynamicJustification,
            subScores: { skills: score, experience: score, formatting: 70, education: 80, keywordMatch: score },
            missingSkills: missingSkills,
            matchedKeywords: matchedKeywords
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const systemPrompt = `
You are a senior technical recruiter and ATS(Applicant Tracking System) evaluator.

Your job is to analyze structured resume data and a job description to simulate a realistic ATS match analysis.

IMPORTANT RULES:
        - Do NOT hallucinate skills or experience.
- Only evaluate information that exists in the resume data.
- Be strict and realistic like real ATS systems used by companies.
- If skills are missing from the resume, mark them as missing.

INPUT YOU WILL RECEIVE:
        1. Structured Resume Data(JSON)
        2. Job Description text

ANALYSIS PROCESS:

Step 1 — Extract Job Keywords
From the job description identify:
        - programming languages
            - frameworks
            - tools
            - cloud platforms
                - databases
                - soft skills
                    - required experience areas

Step 2 — Resume Keyword Matching
Compare resume skills and project technologies with job keywords.

Classify keywords into:
        - matched_keywords
            - partially_matched_keywords
            - missing_keywords

Step 3 — Score the following areas from 0 to 100

Keyword Match Score  
Skills Depth Score  
Experience Relevance Score  
Education Alignment Score  
ATS Formatting Score  

Step 4 — Estimate semantic similarity between the resume and job description.

            Step 5 — Calculate Final ATS Score using this formula:

ATS Score =
            40 % keywordMatch +
            20 % semanticSimilarity +
            15 % skills +
            10 % experience +
            10 % education +
            5 % formatting

Step 6 — Return ONLY JSON in this structure:

Return ONLY valid JSON in this exact structure:
        {
            "score": number,
                "matched_keywords": [],
                    "missing_keywords": [],
                        "subScores": {
                "keywordMatch": number,
                    "semanticSimilarity": number,
                        "skills": number,
                            "experience": number,
                                "education": number,
                                    "formatting": number
            },
            "strengths": [],
                "improvements": [],
                    "justification": "2-3 sentence explanation of the score"
        }

        IMPORTANT:
Do not include any explanation outside the JSON.
Do not include markdown.
Return pure JSON only.
        `;

        const result = await model.generateContent([
            systemPrompt,
            "Resume Data:",
            JSON.stringify(resumeData),
            "Job Description:",
            jobDescription
        ]);

        const response = await result.response;
        let jsonText = response.text().replace(/```json | ```/gi, "").trim();
        const parsedData = JSON.parse(jsonText);

        // Map to expected frontend structure to avoid breaking UI components
        return {
            ...parsedData,
            missingSkills: parsedData.missing_keywords || []
        };
    } catch (error) {
        console.error("Gemini Match Error:", error.message);
        return { score: 0, status: "Error", justification: "Deep match failed." };
    }
}

module.exports = {
    analyzeResume,
    getEmbeddings,
    calculateMatchInsight
};

