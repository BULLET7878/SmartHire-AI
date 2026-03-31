import { useState } from 'react';
import { Link } from 'react-router-dom';
import { analyzeDemoRequest } from '../api';

const DemoPage = () => {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await analyzeDemoRequest({ resumeText, jobDescription });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] w-full py-16 px-6 flex justify-center">
            <div className="max-w-6xl w-full flex flex-col md:flex-row gap-12">
                
                {/* Input Column */}
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-4">
                            ← Back to Home
                        </Link>
                        <h2 className="heading-lg">Try Demo</h2>
                        <p className="text-gray-400">Paste your resume and a job description to see how our AI evaluates the match.</p>
                    </div>

                    <form onSubmit={handleAnalyze} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Resume Text</label>
                            <textarea
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                className="input-field h-48 resize-none"
                                placeholder="Paste your resume content here..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Job Description</label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="input-field h-48 resize-none"
                                placeholder="Paste the job description here..."
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`btn-primary w-full h-14 text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Match'}
                        </button>
                    </form>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl">
                            {error}
                        </div>
                    )}
                </div>

                {/* Result Column */}
                <div className="flex-1">
                    {loading && (
                        <div className="h-full w-full flex flex-col items-center justify-center p-12 glass rounded-3xl min-h-[400px]">
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                            <h3 className="text-xl font-medium">Scanning Document</h3>
                            <p className="text-gray-400 mt-2 text-center">Our AI is extracting skills and experience...</p>
                        </div>
                    )}

                    {!loading && !result && (
                        <div className="h-full w-full flex flex-col items-center justify-center p-12 card min-h-[400px] border-dashed text-center">
                            <span className="text-6xl mb-4 opacity-50">✨</span>
                            <h3 className="text-xl text-gray-300">Awaiting Input</h3>
                            <p className="text-gray-500 mt-2">Fill out the form and hit analyze to see your results.</p>
                        </div>
                    )}

                    {result && (
                        <div className="glass rounded-3xl p-8 relative overflow-hidden animate-in zoom-in-95 duration-500">
                            {/* Decorative Background Glows */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                            
                            <div className="relative z-10 flex flex-col gap-8">
                                {/* Score Card */}
                                <div className="flex flex-col items-center justify-center bg-black/40 rounded-2xl p-6 border border-white/5">
                                    <div className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">ATS Match Score</div>
                                    <div className={`relative flex items-center justify-center w-32 h-32 rounded-full border-4 shadow-[0_0_30px_rgba(34,197,94,0.3)]
                                        ${result.score >= 75 ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : result.score >= 40 ? 'border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]' : 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]'}
                                    `}>
                                        <span className="text-4xl font-bold text-white">{result.score}%</span>
                                    </div>
                                    <div className={`mt-4 font-medium px-4 py-1 rounded-full border
                                         ${result.score >= 75 ? 'text-green-400 bg-green-500/10 border-green-500/20' : result.score >= 40 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}
                                    `}>
                                        {result.status || 'Evaluated'}
                                    </div>
                                </div>

                                {/* Match Breakdown */}
                                {result.subScores && (
                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Match Breakdown</h4>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                            {[
                                                { label: 'Formatting', value: result.subScores.formatting },
                                                { label: 'Experience', value: result.subScores.experience },
                                                { label: 'Skills', value: result.subScores.keywordMatch || result.subScores.skills },
                                                { label: 'Education', value: result.subScores.education }
                                            ].map((sub, i) => (
                                                <div key={i} className="space-y-1.5">
                                                    <div className="flex justify-between text-xs font-bold uppercase text-gray-400">
                                                        <span>{sub.label}</span>
                                                        <span>{sub.value}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                        <div 
                                                            className={`h-full transition-all duration-1000 ${sub.value >= 70 ? 'bg-green-400' : sub.value >= 40 ? 'bg-blue-400' : 'bg-red-400'}`}
                                                            style={{ width: `${sub.value}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Insights */}
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-sm font-black text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <span>✓</span> Matched Requirements
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.matched_skills && result.matched_skills.length > 0 ? (
                                                    result.matched_skills.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-green-400/10 text-green-300 rounded-lg text-xs font-black uppercase tracking-tighter border border-green-500/20">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-xs italic">No matched requirements.</span>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-black text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <span>✕</span> Skill Gaps
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.missing_skills && result.missing_skills.length > 0 ? (
                                                    result.missing_skills.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-red-400/10 text-red-200 rounded-lg text-xs font-black uppercase tracking-tighter border border-red-500/20">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-xs italic">Perfect skill alignment.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {(result.strengths && result.strengths.length > 0) && (
                                        <div className="p-6 bg-green-500/5 rounded-2xl border border-green-500/10">
                                            <h4 className="text-xs font-black text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <span>🚀</span> Key Strengths
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.strengths.map((s, i) => (
                                                    <li key={i} className="text-sm text-gray-300 flex items-start gap-3">
                                                        <span className="text-green-500 mt-0.5">•</span>
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {(result.improvements && result.improvements.length > 0) && (
                                        <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <span>💡</span> Growth Plan
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.improvements.map((s, i) => (
                                                    <li key={i} className="text-sm text-gray-300 flex items-start gap-3">
                                                        <span className="text-blue-500 mt-0.5">•</span>
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {(!result.strengths?.length && !result.improvements?.length && result.suggestions?.length > 0) && (
                                        <div className="pt-4 border-t border-white/10">
                                            <h4 className="text-sm font-black text-gray-400 mb-2 uppercase tracking-widest">Analysis Summary</h4>
                                            <div className="space-y-2">
                                                {result.suggestions.map((sugg, i) => (
                                                    <p key={i} className="text-sm text-gray-300 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                                                        "{sugg}"
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-white/10 text-center">
                                        <p className="text-gray-400 text-sm mb-4">Want to save this analysis and track your applications?</p>
                                        <div className="flex justify-center gap-4">
                                            <Link to="/register" className="btn-primary py-2 px-6 text-sm">Create Free Account</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DemoPage;
