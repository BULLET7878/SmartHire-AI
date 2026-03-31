import { useState, useEffect } from 'react';
import api from '../api';

const UserDashboard = () => {
    // Media & Analysis
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState('');
    const [mySkills, setMySkills] = useState([]);
    const [resumeMeta, setResumeMeta] = useState(null);

    // Job matching
    const [items, setItems] = useState([]);
    const [busy, setBusy] = useState(false);
    const [score, setScore] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const [history, setHistory] = useState(new Set());
    const [myApps, setMyApps] = useState([]);
    const [appSummary, setAppSummary] = useState(null);
    const [applying, setApplying] = useState(new Set());
    const [viewJd, setViewJd] = useState(null);

    // Toast Notification State
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000); // Auto-dismiss after 4 seconds
    };

    // Filter State
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        loadJobs();
        loadApps();
        loadProfile();
    };

    const loadProfile = async () => {
        try {
            const res = await api.get('/resume/mine');
            if (res.data) {
                setMySkills(res.data.skills || []);
                setResumeMeta(res.data.metadata || null);
            }
        } catch (err) {
            // 404 is expected if they haven't uploaded yet
            if (err.response?.status !== 404) {
                console.error("Profile load failed:", err);
            }
        }
    };

    const loadJobs = async () => {
        try {
            setBusy(true);
            const res = await api.get('/jobs');
            setItems(res.data);
        } catch (err) {
            console.error("List load failed:", err);
        } finally {
            setBusy(false);
        }
    };

    const loadApps = async () => {
        try {
            const res = await api.get('/applications/my');
            setMyApps(res.data.applications || res.data);
            setAppSummary(res.data.summary || null);
            const appsList = res.data.applications || res.data;
            const appliedIds = new Set(appsList.map(app => app.job?._id).filter(Boolean));
            setHistory(appliedIds);
        } catch (err) {
            console.error("App load failed:", err);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setMsg('Initializing analysis...');
        setMySkills([]);
        setResumeMeta(null);
        setScore(null);

        const data = new FormData();
        data.append('resume', file);

        try {
            setMsg('Analyzing resume...');
            const res = await api.post('/resume/upload', data);
            setMySkills(res.data.skills);
            setResumeMeta(res.data.metadata);

            // Clear stale match results
            setScore(null);
            setActiveId(null);

            // Refresh user feed
            loadJobs();
            loadApps();

            setFile(null);
            setMsg('Analysis complete!');
            setTimeout(() => setMsg(''), 4000);
        } catch (err) {
            console.error("Upload Error Details:", err.response?.data || err.message);
            setMsg(err.response?.data?.message || 'Failed to process. Try again.');

            // Reset on failure
            setMySkills([]);
            setResumeMeta(null);
            setScore(null);
        }
    };

    const checkFit = async (id) => {
        try {
            setActiveId(id);
            setScore(null);
            const res = await api.get(`/applications/insight/${id}`);
            setScore(res.data);
        } catch (err) {
            console.error("Fit test failed");
        }
    };


    const apply = async (id) => {
        if (applying.has(id)) return;

        try {
            setApplying(prev => new Set(prev).add(id));
            await api.post(`/applications/${id}`);
            showToast('Application sent successfully!');
            loadApps();
        } catch (err) {
            console.error("Apply failed details:", {
                id,
                message: err.message,
                code: err.code,
                response: err.response,
                url: `/applications/${id}`
            });
            // Backend error message matching
            showToast(err.response?.data?.message || 'Application failed. Please check your connection.', 'error');
        } finally {
            setApplying(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Resume Section */}
            <section className="card border-t-4 border-t-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <span className="text-8xl font-black italic">RESUME</span>
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white mb-2">Build Your Profile</h2>
                    <p className="text-gray-400 mb-8 max-w-md text-sm">Upload your PDF resume to start matching with exclusive opportunities.</p>

                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        <div className="flex-1 w-full group">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-4 ml-1">Attach PDF</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf,.docx"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="w-full h-14 opacity-0 absolute inset-0 z-20 cursor-pointer"
                                />
                                <div className="w-full h-14 bg-black border-2 border-dashed border-white/10 rounded-2xl flex items-center px-6 transition-all group-hover:border-white/30 group-hover:bg-white/5">
                                    <span className="text-sm font-bold text-gray-400 truncate pr-4">
                                        {file ? file.name : "Drop PDF or DOCX here..."}
                                    </span>
                                    <span className="ml-auto text-xs font-black text-blue-400">SELECT</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={!file}
                            className="btn-primary w-full md:w-auto px-10 h-14"
                        >
                            {msg || 'Analyze PDF'}
                        </button>
                    </div>

                    {mySkills.length > 0 && (
                        <div className="mt-10 pt-10 border-t border-white/5 space-y-8">
                            {/* ATS Score Panel */}
                            {resumeMeta && (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-black text-white italic">ATS Profile Strength</h3>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Base Resume Evaluation</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className={`text-4xl font-black italic tracking-tighter ${(resumeMeta.hasExperience ? 25 : 0) + (resumeMeta.hasEducation ? 25 : 0) + (resumeMeta.hasProjects ? 25 : 0) + (mySkills.length >= 5 ? 25 : 0) >= 75
                                                ? 'text-green-400'
                                                : 'text-yellow-400'
                                                }`}>
                                                {(resumeMeta.hasExperience ? 25 : 0) + (resumeMeta.hasEducation ? 25 : 0) + (resumeMeta.hasProjects ? 25 : 0) + (mySkills.length >= 5 ? 25 : 0)}/100
                                            </span>
                                            {resumeMeta.aiSummary?.includes('Basic analysis') && (
                                                <div className="mt-1 px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs font-black text-yellow-400 uppercase tracking-widest">
                                                    Basic Mode
                                                </div>
                                            )}
                                            {/* Progress Bar */}
                                            <div className="w-32 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${(resumeMeta.hasExperience ? 25 : 0) + (resumeMeta.hasEducation ? 25 : 0) + (resumeMeta.hasProjects ? 25 : 0) + (mySkills.length >= 5 ? 25 : 0) >= 75 ? 'bg-green-400' : 'bg-yellow-400'}`}
                                                    style={{ width: `${(resumeMeta.hasExperience ? 25 : 0) + (resumeMeta.hasEducation ? 25 : 0) + (resumeMeta.hasProjects ? 25 : 0) + (mySkills.length >= 5 ? 25 : 0)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className={`p-3 rounded-xl border ${resumeMeta.hasExperience ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                            <p className="text-xs font-black uppercase tracking-widest mb-1 text-gray-400">Experience</p>
                                            <p className={`font-black ${resumeMeta.hasExperience ? 'text-green-400' : 'text-red-400'}`}>{resumeMeta.hasExperience ? 'DETECTED (+25)' : 'MISSING'}</p>
                                        </div>
                                        <div className={`p-3 rounded-xl border ${resumeMeta.hasEducation ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                            <p className="text-xs font-black uppercase tracking-widest mb-1 text-gray-400">Education</p>
                                            <p className={`font-black ${resumeMeta.hasEducation ? 'text-green-400' : 'text-red-400'}`}>{resumeMeta.hasEducation ? 'DETECTED (+25)' : 'MISSING'}</p>
                                        </div>
                                        <div className={`p-3 rounded-xl border ${resumeMeta.hasProjects ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                            <p className="text-xs font-black uppercase tracking-widest mb-1 text-gray-400">Projects</p>
                                            <p className={`font-black ${resumeMeta.hasProjects ? 'text-green-400' : 'text-red-400'}`}>{resumeMeta.hasProjects ? 'DETECTED (+25)' : 'MISSING'}</p>
                                        </div>
                                        <div className={`p-3 rounded-xl border ${mySkills.length >= 5 ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                                            <p className="text-xs font-black uppercase tracking-widest mb-1 text-gray-400">Keywords</p>
                                            <p className={`font-black ${mySkills.length >= 5 ? 'text-green-400' : 'text-yellow-400'}`}>{mySkills.length} Found {mySkills.length >= 5 ? '(+25)' : ''}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Keywords Found</p>
                                <div className="flex flex-wrap gap-2">
                                    {mySkills.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white text-xs font-black rounded-lg uppercase tracking-tighter">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Overview Portal */}
            {(myApps.length > 0 || appSummary) && (
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-in fade-in zoom-in duration-700">
                    <div className="card bg-blue-500/5 border-blue-500/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-blue-500/10 transition-all">
                        <span className="text-3xl md:text-4xl font-black text-blue-400 mb-2">{appSummary?.totalApplications || myApps.length}</span>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Applied</p>
                    </div>
                    <div className="card bg-purple-500/5 border-purple-500/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-purple-500/10 transition-all">
                        <span className="text-3xl md:text-4xl font-black text-purple-400 mb-2">{appSummary?.averageScore || 0}%</span>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Avg ATS Score</p>
                    </div>
                    <div className="card bg-green-500/5 border-green-500/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-green-500/10 transition-all">
                        <span className="text-3xl md:text-4xl font-black text-green-400 mb-2">{appSummary?.shortlistedCount || myApps.filter(a => ['Shortlisted', 'Interviewed'].includes(a.status)).length}</span>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Shortlisted</p>
                    </div>
                    <div className="card bg-yellow-500/5 border-yellow-500/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-yellow-500/10 transition-all">
                        <span className="text-3xl md:text-4xl font-black text-yellow-400 mb-2">{appSummary?.profileStrength || (mySkills.length > 0 ? 75 : 0)}%</span>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Profile Strength</p>
                    </div>
                </section>
            )}

            {/* Matched Feed */}
            {mySkills.length > 0 && (
                <section className="space-y-10">
                    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between border-b border-white/5 pb-6 gap-4">
                        <h2 className="text-3xl font-black text-white">Your Feed</h2>
                        <div className="flex items-center gap-4">
                            <button onClick={loadJobs} className="text-xs font-black bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest text-gray-400 hover:text-white">Refresh List</button>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="text-xs font-black bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest text-gray-400 focus:text-white outline-none cursor-pointer appearance-none"
                            >
                                <option className="bg-[#0A0A0A]" value="All">All Types</option>
                                <option className="bg-[#0A0A0A]" value="Full-time">Full-time</option>
                                <option className="bg-[#0A0A0A]" value="Internship">Internship</option>
                                <option className="bg-[#0A0A0A]" value="Contract">Contract</option>
                                <option className="bg-[#0A0A0A]" value="Part-time">Part-time</option>
                            </select>
                        </div>
                    </div>

                    {busy && <div className="animate-pulse flex items-center gap-3 text-gray-500 font-bold"><div className="w-2 h-2 bg-blue-400 rounded-full"></div>Scanning database...</div>}

                    <div className="grid gap-8">
                        {items
                            .filter(row => {
                                // 0. Job Type Filter
                                if (filterType !== 'All' && row.jobType !== filterType) return false;

                                // 1. Filter out already applied jobs to keep feed fresh
                                if (history.has(row._id)) return false;

                                // 2. Keyword matching logic
                                if (!row.requiredSkills || row.requiredSkills.length === 0) return true;
                                const rowLower = row.requiredSkills.map(s => s.toLowerCase());
                                const myLower = mySkills.map(s => s.toLowerCase());
                                return rowLower.some(s => myLower.some(m => m.includes(s) || s.includes(m)));
                            })
                            .map((row, i) => (
                                <div
                                    key={row._id}
                                    className="card bg-white/5 border-white/5 hover:border-white/20 transition-all duration-500 group relative overflow-hidden"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></div>

                                    <div className="flex flex-col md:flex-row justify-between gap-10 relative z-10">
                                        <div className="space-y-6 flex-1">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-black text-white">{row.title}</h3>
                                                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 uppercase tracking-widest">{row.jobType}</span>
                                                    {history.has(row._id) && (
                                                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-tighter">
                                                            {myApps.find(a => a.job?._id === row._id)?.status || 'Applied'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300 mt-2">
                                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">🏢 {row.company}</span>
                                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">📍 {row.location}</span>
                                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">💰 {row.stipend}</span>
                                                    {row.experienceLevel && <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg text-blue-300">⚡ {row.experienceLevel}</span>}
                                                    {row.duration && <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">⏳ {row.duration}</span>}
                                                    {row.joiningMonth && <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">🗓 {row.joiningMonth}</span>}
                                                </div>

                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-blue-400 font-bold text-xs uppercase tracking-wide">👥 {row.applicantCount || 0} Applied</span>
                                                </div>

                                                {row.requiredSkills && row.requiredSkills.length > 0 && (
                                                    <div className="mt-4 space-y-2">
                                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Required Skills</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {row.requiredSkills.map((skill, idx) => (
                                                                <span key={idx} className="px-2 py-1 bg-white/5 border border-white/10 text-xs font-black text-gray-300 rounded-md uppercase tracking-tighter shadow-sm">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 md:w-48">
                                            <button
                                                onClick={() => checkFit(row._id)}
                                                className={`w-full px-4 py-3 rounded-2xl text-xs font-black tracking-widest uppercase transition-all shadow-xl ${activeId === row._id && score ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'}`}
                                            >
                                                {activeId === row._id && score ? 'Show Metric' : 'Check Quality'}
                                            </button>
                                            <button
                                                onClick={() => apply(row._id)}
                                                disabled={history.has(row._id) || applying.has(row._id)}
                                                className={`w-full px-4 py-3 rounded-2xl text-xs font-black tracking-widest uppercase transition-all shadow-2xl ${history.has(row._id)
                                                    ? 'bg-green-500/10 border border-green-500/30 text-green-400 cursor-not-allowed'
                                                    : applying.has(row._id)
                                                        ? 'bg-blue-600/10 border border-blue-500/30 text-blue-400 cursor-wait'
                                                        : 'bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300'
                                                    }`}
                                            >
                                                {history.has(row._id) ? 'Applied' : applying.has(row._id) ? 'Applying...' : 'Apply Now'}
                                            </button>
                                            {row.jdPath && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setViewJd(row.jdPath);
                                                    }}
                                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all flex items-center gap-3 shadow-xl group/jd"
                                                >
                                                    <span className="text-lg group-hover/jd:scale-110 transition-transform">📄</span>
                                                    <span>View JD</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>


                                    {/* Match Insight */}
                                    {activeId === row._id && score && (
                                        <div className="mt-10 pt-10 border-t border-white/5 animate-in fade-in slide-in-from-top-6 duration-700">
                                            {/* Match Insight Metric */}
                                            <div className="flex items-center justify-between mb-10">
                                                <div className="flex items-center gap-6">
                                                    <div className={`text-7xl font-black italic tracking-tighter ${score.score >= 75 ? 'text-green-400' : score.score >= 40 ? 'text-blue-400' : 'text-red-400'}`}>
                                                        {score.score}%
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className={`text-xs font-black uppercase tracking-[0.3em] px-3 py-1 rounded-lg border inline-block ${score.status === 'Strong Match' ? 'bg-green-500/20 border-green-500/30 text-green-400' : score.status === 'Medium Match' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
                                                            {score.status}
                                                        </p>
                                                        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">ATS Match Score</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-4">
                                                    <p className="text-xs font-black text-green-400 uppercase tracking-widest">Strengths</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {score.matched_keywords && score.matched_keywords.map((s, idx) => (
                                                            <span key={`matched-${idx}`} className="px-3 py-1.5 bg-green-400/10 text-green-300 text-xs font-black rounded-lg uppercase tracking-tighter">{s}</span>
                                                        ))}
                                                        {(!score.matched_keywords || score.matched_keywords.length === 0) && <span className="text-gray-600 italic text-xs">No direct hits</span>}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <p className="text-xs font-black text-red-500 uppercase tracking-widest">Skill Gaps</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {score.missingSkills && score.missingSkills.map((s, idx) => (
                                                            <span key={`missing-${idx}`} className="px-3 py-1.5 bg-red-400/10 text-red-400 text-xs font-black rounded-lg uppercase tracking-tighter">{s}</span>
                                                        ))}
                                                        {(!score.missingSkills || score.missingSkills.length === 0) && <span className="text-gray-600 italic text-xs">Perfect match</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ATS Breakdown Scores */}
                                            {score.subScores && (
                                                <div className="mt-8 grid grid-cols-4 gap-4">
                                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Formatting</p>
                                                        <p className="text-lg font-black text-white">{score.subScores.formatting}%</p>
                                                    </div>
                                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Experience</p>
                                                        <p className="text-lg font-black text-white">{score.subScores.experience}%</p>
                                                    </div>
                                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Keywords</p>
                                                        <p className="text-lg font-black text-white">{score.subScores.keywordMatch || score.subScores.projects}%</p>
                                                    </div>
                                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Education</p>
                                                        <p className="text-lg font-black text-white">{score.subScores.education}%</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* AI Match Explainer / Advice */}
                                            <div className="mt-10 p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl animate-in zoom-in-95 duration-500">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-xl">💡</span>
                                                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Growth Plan to 100%</p>
                                                </div>
                                                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                                    {score.justification}
                                                </p>
                                                {score.recommendations && score.recommendations.length > 0 && (
                                                    <ul className="list-disc pl-5 space-y-2 text-xs text-white/70">
                                                        {score.recommendations.map((rec, idx) => (
                                                            <li key={idx}>{rec}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                        {!busy && items.length === 0 && (
                            <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-2">🔍</div>
                                <p className="text-xl font-black text-white tracking-tighter">No Job Matches Yet</p>
                                <p className="text-gray-500 text-sm max-w-sm">We couldn't find any relevant positions matching your parsed skills.</p>
                                <a href="/demo" className="mt-4 px-6 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Try Demo</a>
                            </div>
                        )}
                    </div>
                </section>
            )}
            {/* Applications History - Persistent Record */}
            {myApps.length > 0 && (
                <section className="space-y-12 pt-16 border-t border-white/5">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-white italic tracking-tighter">APPLIED PORTAL</h2>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                                <span className="w-12 h-px bg-white/10"></span>
                                Verified Professional History
                            </p>
                        </div>
                    </div>

                    <div className="space-y-16">
                        {Object.entries(
                            myApps.reduce((acc, app) => {
                                const company = app.job?.company || 'Other';
                                if (!acc[company]) acc[company] = [];
                                acc[company].push(app);
                                return acc;
                            }, {})
                        ).map(([company, apps]) => (
                            <div key={company} className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-white/5"></div>
                                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">{company}</h3>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {apps.map((app) => (
                                        <div key={app._id} className="card bg-white/5 border-white/5 hover:bg-white/[0.08] transition-all group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${app.status === 'Shortlisted' ? 'bg-purple-400' : app.status === 'Rejected' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                                                    <span className={`text-xs font-black uppercase tracking-widest ${app.status === 'Shortlisted' ? 'text-purple-400' : app.status === 'Rejected' ? 'text-red-400' : 'text-blue-400'}`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                                <div className="px-2 py-1 bg-white/5 border border-white/5 rounded text-xs font-black italic flex items-center gap-2">
                                                    <span className={`${app.matchScore >= 75 ? 'text-green-400' : app.matchScore >= 40 ? 'text-blue-400' : 'text-yellow-400'}`}>
                                                        Match Score: {app.matchScore || 0}%
                                                    </span>
                                                    {app.matchStatus && <span className={`uppercase tracking-widest ${app.matchStatus === 'Strong Match' ? 'text-green-500' : app.matchStatus === 'Medium Match' ? 'text-blue-500' : 'text-gray-400'}`}>[{app.matchStatus}]</span>}
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <h4 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tighter leading-tight">
                                                        {app.job?.title || 'System Archive'}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                            <span className="opacity-50 text-xs">🏢</span> {app.job?.company}
                                                        </p>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                            <span className="opacity-50 text-xs">📍</span> {app.job?.location}
                                                        </p>
                                                    </div>
                                                </div>

                                                {app.justification && (
                                                    <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Match Justification</p>
                                                        <p className="text-xs text-gray-300 leading-relaxed italic">"{app.justification}"</p>
                                                    </div>
                                                )}

                                                {app.matchedKeywords && app.matchedKeywords.length > 0 && (
                                                    <div className="mt-3 space-y-1">
                                                        <p className="text-xs font-black text-green-400 uppercase tracking-widest">Matched Skills</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {app.matchedKeywords.slice(0, 5).map(skill => (
                                                                <span key={skill} className="px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 text-xs font-black text-green-400 rounded-md uppercase tracking-tighter">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {app.missingSkills && app.missingSkills.length > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-xs font-black text-red-400 uppercase tracking-widest">Skill Gaps</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {app.missingSkills.slice(0, 5).map(skill => (
                                                                <span key={skill} className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-xs font-black text-red-400 rounded-md uppercase tracking-tighter">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Budget</p>
                                                        <p className="text-white text-xs font-black">{app.job?.stipend}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">Timeline</p>
                                                        <div className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                                            {new Date(app.appliedAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {/* JD Viewer Modal */}
            {viewJd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewJd(null)}></div>
                    <div className="relative w-full max-w-6xl h-[85vh] bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Job Description Details</h3>
                            <div className="flex items-center gap-4">
                                <a
                                    href={`/uploads/${viewJd}?token=${localStorage.getItem('token')}`}
                                    download
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                                >
                                    Download PDF
                                </a>
                                <button
                                    onClick={() => setViewJd(null)}
                                    className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#1a1a1a] p-1 relative">
                            <object
                                data={`/uploads/${viewJd}?token=${localStorage.getItem('token')}#toolbar=0&navpanes=0&scrollbar=0`}
                                type="application/pdf"
                                className="w-full h-full rounded-xl border border-white/5"
                            >
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                                    <p>Browser unable to embed PDF natively.</p>
                                    <a
                                        href={`/uploads/${viewJd}?token=${localStorage.getItem('token')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold"
                                    >
                                        Open in New Tab
                                    </a>
                                </div>
                            </object>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Toast Notification */}
            {toast && (
                <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300 z-50 ${toast.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                    <span className="text-2xl">{toast.type === 'success' ? '✅' : '❌'}</span>
                    <span className="text-sm font-black tracking-widest uppercase">{toast.message}</span>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
