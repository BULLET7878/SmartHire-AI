const { calculateCosineSimilarity } = require('./nlpUtil');

const calculateMatchScore = (resume, job) => {
    if (!resume || !job) {
        return { score: 0, status: "Weak Match", matchedSkills: [], missingSkills: [] };
    }

    const userSkills = (resume.skills || []).map(s => s.toLowerCase());
    const jobSkills = (job.requiredSkills || []).map(s => s.toLowerCase());

    // 1. Keyword-based Skill Score (Weight: 50%)
    let skillScore = 0;
    let matchedSkills = [];
    let missingSkills = [];

    if (jobSkills.length > 0) {
        matchedSkills = jobSkills.filter(skill => userSkills.includes(skill));
        missingSkills = jobSkills.filter(skill => !userSkills.includes(skill));
        skillScore = (matchedSkills.length / jobSkills.length) * 50;
    } else {
        skillScore = 50;
    }

    // 2. NLP-based Description Similarity Score (Weight: 30%)
    const similarity = calculateCosineSimilarity(resume.rawText, job.description || "");
    const similarityScore = similarity * 30;

    // 3. Experience and Metadata Score (Weight: 20%)
    let expScore = 0;
    if (resume.metadata?.hasExperience) expScore = 10;
    else if (resume.metadata?.experienceKeywords > 2) expScore = 7;

    let otherScore = 0;
    if (resume.metadata?.hasEducation) otherScore += 5;
    if (resume.metadata?.hasProjects) otherScore += 5;

    // Final Weighted Average
    const totalScore = Math.round(skillScore + similarityScore + expScore + otherScore);

    let status = "Weak Match";
    if (totalScore >= 70) status = "Strong Match";
    else if (totalScore >= 40) status = "Medium Match";

    return {
        score: Math.min(totalScore, 100), // Cap at 100
        status,
        matchedSkills,
        missingSkills,
        details: {
            skillScore: Math.round(skillScore),
            similarityScore: Math.round(similarityScore),
            expScore,
            otherScore
        }
    };
};

module.exports = calculateMatchScore;
