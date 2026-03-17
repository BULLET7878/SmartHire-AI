import { useState, useEffect } from 'react';
import api from '../api';

const RecruiterDashboard = ({ onJobCreated }) => {
    // Media & Local state
    const [title, setTitle] = useState('');
    const [skills, setSkills] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [type, setType] = useState('Full-time');
    const [experience, setExperience] = useState('Mid Level');
    const [duration, setDuration] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [jdFile, setJdFile] = useState(null);
    const [msg, setMsg] = useState('');

    // Listings & Applicants
    const [items, setItems] = useState([]);
    const [busy, setBusy] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [activeJob, setActiveJob] = useState(null);
    const [pulse, setPulse] = useState(null);

    // ATS Filters
    const [filterMatch, setFilterMatch] = useState(0);
    const [filterSkill, setFilterSkill] = useState('');
    const [filterExperience, setFilterExperience] = useState('All');
    const [filterSort, setFilterSort] = useState('match'); // 'match', 'date'

    // Resume Viewer
    const [viewResume, setViewResume] = useState(null);

    // Toast & Dialog States
    const [toast, setToast] = useState(null);
    const [jobToDelete, setJobToDelete] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setBusy(true);
            const res = await api.get('/jobs/my');
            setItems(res.data);
            const pulseRes = await api.get('/applications/pulse');
            setPulse(pulseRes.data);
        } catch (err) {
            console.error("Link broken:", err);
        } finally {
            setBusy(false);
        }
    };

    const flush = () => {
        setTitle('');
        setSkills('');
        setCompany('');
        setLocation('');
        setSalary('');
        setType('Full-time');
        setExperience('Mid Level');
        setDuration('');
        setStartMonth('');
        setJdFile(null);
        setEditingId(null);
        // Reset file input manually
        const fileInput = document.getElementById('jd-upload');
        if (fileInput) fileInput.value = '';
    };

    const submit = async () => {
        if (!title || !skills || !company || !location || !salary) {
            setMsg('Missing required fields');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('requiredSkills', JSON.stringify(skills.split(',').map(s => s.trim())));
            formData.append('experienceLevel', experience);
            formData.append('company', company);
            formData.append('location', location);
            formData.append('stipend', salary);
            formData.append('jobType', type);
            formData.append('duration', duration);
            formData.append('joiningMonth', startMonth);

            if (jdFile) {
                formData.append('jdFile', jdFile);
            }

            if (editingId) {
                await api.put(`/jobs/${editingId}`, formData);
                setMsg('Update successful');
            } else {
                await api.post('/jobs', formData);
                setMsg('Position published');
            }

            flush();
            loadData();
            if (onJobCreated) onJobCreated();
            setTimeout(() => setMsg(''), 4000);
        } catch (err) {
            console.error("Submit Error:", err);
            setMsg(err.response?.data?.message || 'Save failed');
        }
    };

    const triggerDelete = (job) => {
        setJobToDelete(job);
    };

    const confirmDelete = async () => {
        if (!jobToDelete) return;
        try {
            await api.delete(`/jobs/${jobToDelete._id}`);
            loadData();
            showToast('Listing removed successfully', 'success');
        } catch (err) {
            console.error("Delete failed:", err);
            showToast('Failed to remove listing', 'error');
        } finally {
            setJobToDelete(null);
        }
    };

    const edit = (job) => {
        setTitle(job.title);
        setSkills(job.requiredSkills.join(', '));
        setCompany(job.company);
        setLocation(job.location);
        setSalary(job.stipend);
        setType(job.jobType);
        setExperience(job.experienceLevel || 'Mid Level');
        setDuration(job.duration || '');
        setStartMonth(job.joiningMonth || '');
        setEditingId(job._id);
        const element = document.getElementById('job-form');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const viewApplicants = async (job) => {
        try {
            setActiveJob(job);
            setApplicants([]); // Clear previous

            // Scroll immediately to show "loading" state
            setTimeout(() => {
                const element = document.getElementById('applicant-feed');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);

            const res = await api.get(`/applications/job/${job._id}`);
            setApplicants(res.data);
        } catch (err) {
            console.error("Failed to load applicants", err);
            setMsg('Could not load applicants');
        }
    };

    const updateStatus = async (appId, newStatus) => {
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            // Refresh applicants for the active job
            if (activeJob) viewApplicants(activeJob);
        } catch (err) {
            console.error("Status update failed");
        }
    };

    const reEvaluateAts = async (jobId) => {
        try {
            setMsg('Re-evaluating ATS scores...');
            await api.post(`/jobs/${jobId}/re-evaluate`);
            if (activeJob && activeJob._id === jobId) {
                viewApplicants(activeJob);
            }
            setMsg('ATS re-evaluation complete');
            setTimeout(() => setMsg(''), 4000);
        } catch (err) {
            console.error("Re-evaluate failed");
            setMsg('Failed to re-evaluate ATS scores');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Minimal Header */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]"></span>
                        <h2 className="text-[12px] font-black text-blue-400 uppercase tracking-[0.5em]">Recruitment HQ</h2>
                    </div>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter">Acquire Talent.</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[12px] font-black text-gray-500 uppercase tracking-widest">Global Reach</p>
                        <p className="text-white font-black">Active Mode</p>
                    </div>
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl">💼</div>
                </div>
            </header>

            {/* Hiring Pulse */}
            {pulse && (
                <section className="animate-in fade-in zoom-in duration-1000">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="card bg-blue-500/5 border-blue-500/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-blue-500/10 transition-all">
                            <span className="text-3xl md:text-4xl font-black text-blue-400 mb-2">{pulse.totalJobs}</span>
                            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Active Postings</p>
                        </div>
                        <div className="card bg-purple-500/5 border-purple-500/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-purple-500/10 transition-all">
                            <span className="text-3xl md:text-4xl font-black text-purple-400 mb-2">{pulse.totalApplied}</span>
                            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Applicants</p>
                        </div>
                        <div className="card bg-green-500/5 border-green-500/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-green-500/10 transition-all">
                            <span className="text-3xl md:text-4xl font-black text-green-400 mb-2">{pulse.averageScore || 0}%</span>
                            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Avg Candidate Score</p>
                        </div>
                        <div className="card bg-yellow-500/5 border-yellow-500/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-yellow-500/10 transition-all">
                            <span className="text-3xl md:text-4xl font-black text-yellow-400 mb-2">{pulse.topCandidates || 0}</span>
                            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Top Performers (80%+)</p>
                        </div>
                    </div>

                    <div className="mt-12 bg-white/5 border border-white/10 rounded-[40px] p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                            <span className="text-9xl font-black italic">FUNNEL</span>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.4em] mb-12 text-center">Hiring Momentum</h3>

                            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 text-[10px] font-black text-gray-500 uppercase">Applied</div>
                                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: '100%' }}></div>
                                    </div>
                                    <div className="w-12 text-right text-xs font-bold">{pulse.totalApplied}</div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-24 text-[10px] font-black text-gray-500 uppercase">Reviewed</div>
                                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${(pulse.reviewed / pulse.totalApplied) * 100 || 0}%` }}></div>
                                    </div>
                                    <div className="w-12 text-right text-xs font-bold">{pulse.reviewed}</div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-24 text-[10px] font-black text-gray-500 uppercase">Qualified</div>
                                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${(pulse.shortlisted / pulse.totalApplied) * 100 || 0}%` }}></div>
                                    </div>
                                    <div className="w-12 text-right text-xs font-bold">{pulse.shortlisted}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Form Section */}
                <section id="job-form" className="lg:col-span-12 card border-l-4 border-l-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                        <span className="text-9xl font-black italic">POST</span>
                    </div>

                    <div className="relative z-10">
                        <div className="mb-12">
                            <h3 className="text-3xl font-black text-white mb-2">{editingId ? 'Refine Listing' : 'New Opportunity'}</h3>
                            <p className="text-gray-400 text-sm max-w-lg">Define your requirements and connect with pre-screened, high-match candidates immediately.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {/* Identity Section */}
                            <div className="space-y-8">
                                <h4 className="text-[12px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-4">
                                    <span className="w-4 h-px bg-blue-500/50"></span>
                                    Identity & Role
                                </h4>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Job Designation</label>
                                        <input type="text" className="input-field" placeholder="e.g. Senior Kernel Engineer" value={title} onChange={(e) => setTitle(e.target.value)} />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Organization</label>
                                        <input type="text" className="input-field" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Location</label>
                                            <input type="text" className="input-field text-xs" placeholder="City / Remote" value={location} onChange={(e) => setLocation(e.target.value)} />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Experience</label>
                                            <select className="input-field text-xs appearance-none" value={experience} onChange={(e) => setExperience(e.target.value)}>
                                                <option className="bg-slate-900" value="Entry">Entry Level</option>
                                                <option className="bg-slate-900" value="Mid Level">Mid Level</option>
                                                <option className="bg-slate-900" value="Senior">Senior</option>
                                                <option className="bg-slate-900" value="Lead">Lead / Staff</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Type</label>
                                        <select className="input-field text-xs appearance-none" value={type} onChange={(e) => setType(e.target.value)}>
                                            <option className="bg-slate-900" value="Full-time">Full-time</option>
                                            <option className="bg-slate-900" value="Part-time">Part-time</option>
                                            <option className="bg-slate-900" value="Contract">Contract</option>
                                            <option className="bg-slate-900" value="Internship">Internship</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Expertise Section */}
                            <div className="space-y-8">
                                <h4 className="text-[12px] font-black text-purple-400 uppercase tracking-[0.3em] flex items-center gap-4">
                                    <span className="w-4 h-px bg-purple-500/50"></span>
                                    Expertise & Returns
                                </h4>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Required Keywords</label>
                                        <input type="text" className="input-field" placeholder="React, Node.js, AWS..." value={skills} onChange={(e) => setSkills(e.target.value)} />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Stipend / Package</label>
                                        <input type="text" className="input-field" placeholder="Fixed or Scale" value={salary} onChange={(e) => setSalary(e.target.value)} />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Job Description PDF</label>
                                        <div className="relative">
                                            <input
                                                id="jd-upload"
                                                type="file"
                                                accept=".pdf"
                                                className="hidden"
                                                onChange={(e) => setJdFile(e.target.files[0])}
                                            />
                                            <label
                                                htmlFor="jd-upload"
                                                className="input-field flex items-center justify-between cursor-pointer hover:border-blue-500/50 transition-all overflow-hidden"
                                            >
                                                <span className="truncate text-xs text-gray-400">
                                                    {jdFile ? jdFile.name : 'Upload Detailed JD (PDF)'}
                                                </span>
                                                <span className="bg-white/5 px-4 py-2 rounded-lg text-[10px] font-black uppercase">Browse</span>
                                            </label>
                                        </div>
                                    </div>
                                    {(type === 'Internship' || type === 'Contract') && (
                                        <div className="group animate-in fade-in slide-in-from-top-4">
                                            <label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Duration</label>
                                            <input type="text" className="input-field" placeholder="e.g. 6 Months" value={duration} onChange={(e) => setDuration(e.target.value)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between mt-16 pt-10 border-t border-white/5 gap-6">
                            <div className="max-w-xs">
                                {msg && (
                                    <p className={`text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl animate-in zoom-in ${msg.includes('position') || msg.includes('Update') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {msg}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                {editingId && <button onClick={flush} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all">Cancel</button>}
                                <button onClick={submit} className="flex-1 md:flex-initial px-12 py-4 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all hover:bg-white/10 hover:tracking-[0.2em] active:scale-[0.97] shadow-2xl relative overflow-hidden group/btn">
                                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {editingId ? 'Update Listing' : 'Publish Position'}
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* List Section */}
                <section className="lg:col-span-12 space-y-10">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-6">
                            <h3
                                onClick={() => setFilterMatch(0)} // Reset filters on tab switch hack
                                className={`text-3xl font-black italic tracking-tighter cursor-pointer transition-colors ${!editingId ? 'text-white' : 'text-gray-600'}`}
                            >
                                Your Postings
                            </h3>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg">Active</button>
                                <button className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg">Closed</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">{items.length} Postings</span>
                            <button onClick={loadData} className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">🔄</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {items.map((job) => (
                            <div key={job._id} className={`card ${activeJob?._id === job._id ? 'border-blue-500/50 bg-blue-500/5' : 'bg-white/5 border-white/5'} ${job.status === 'Closed' ? 'opacity-50 grayscale' : ''} hover:border-white/20 transition-all duration-500 group relative`}>
                                <div className="absolute top-0 right-0 p-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                                    <button onClick={() => edit(job)} className="w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-black rounded-xl flex items-center justify-center transition-all border border-white/10 shadow-xl" title="Edit">✏️</button>
                                    <button onClick={() => triggerDelete(job)} className="w-10 h-10 bg-white/10 hover:bg-red-500 text-white rounded-xl flex items-center justify-center transition-all border border-white/10 shadow-xl" title="Delete">🗑️</button>
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            await api.put(`/jobs/${job._id}/toggle`);
                                            loadData();
                                        }}
                                        className={`w-10 h-10 bg-white/10 hover:bg-yellow-500 text-white rounded-xl flex items-center justify-center transition-all border border-white/10 shadow-xl ${job.status === 'Closed' ? 'hover:bg-green-500' : ''}`}
                                        title={job.status === 'Closed' ? 'Re-activate' : 'Archive / Close'}
                                    >
                                        {job.status === 'Closed' ? '🔓' : '🔒'}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex gap-2">
                                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border ${job.jobType === 'Internship' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                                {job.jobType}
                                            </span>
                                            {job.status === 'Closed' && (
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border bg-red-500/10 border-red-500/20 text-red-400">
                                                    CLOSED
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-2xl font-black text-white mt-3 group-hover:text-blue-400 transition-colors truncate pr-12">{job.title}</h4>
                                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mt-1">{job.company} • {job.location}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-tighter">Budget</p>
                                            <p className="text-white text-sm font-black italic">{job.stipend}</p>
                                        </div>
                                        <button
                                            onClick={() => viewApplicants(job)}
                                            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 text-white rounded-xl text-[12px] font-black uppercase tracking-widest transition-all shadow-lg"
                                        >
                                            Applicants ({job.applicantCount || 0})
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {items.length === 0 && !busy && (
                        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                            <p className="text-2xl font-black text-gray-600 italic">No Active Talent Acquisition</p>
                        </div>
                    )}
                </section>

                {/* Applicant Feed */}
                {activeJob && (
                    <section id="applicant-feed" className="lg:col-span-12 space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 scroll-mt-24">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-2 border-white/10 pb-8">
                            <div className="space-y-2">
                                <p className="text-[12px] font-black text-green-400 uppercase tracking-[0.5em]">Live Applications</p>
                                <h3 className="text-4xl font-black text-white italic tracking-tighter">{activeJob.title}</h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Min Match %</label>
                                    <select value={filterMatch} onChange={(e) => setFilterMatch(Number(e.target.value))} className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-white hover:border-blue-500/50 transition-all outline-none">
                                        <option className="bg-slate-900" value="0">All Scores</option>
                                        <option className="bg-slate-900" value="75">75%+ (Strong)</option>
                                        <option className="bg-slate-900" value="50">50%+ (Mid)</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Skill Filter</label>
                                    <input type="text" placeholder="Filter by skill..." value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)} className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-white hover:border-blue-500/50 transition-all outline-none w-32" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Experience</label>
                                    <select value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)} className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-white hover:border-blue-500/50 transition-all outline-none">
                                        <option className="bg-slate-900" value="All">All Exp</option>
                                        <option className="bg-slate-900" value="Required">Has Experience</option>
                                        <option className="bg-slate-900" value="Fresh">Freshers</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Sort By</label>
                                    <select value={filterSort} onChange={(e) => setFilterSort(e.target.value)} className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-white hover:border-blue-500/50 transition-all outline-none">
                                        <option className="bg-slate-900" value="match">Match Score</option>
                                        <option className="bg-slate-900" value="date">Date Applied</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 md:ml-4 mt-auto">
                                    <button onClick={() => reEvaluateAts(activeJob._id)} className="text-[10px] font-black bg-blue-500/10 px-4 py-3 rounded-2xl border border-blue-500/30 hover:bg-blue-500/20 transition-all uppercase tracking-widest text-blue-400">
                                        Re-evaluate ATS
                                    </button>
                                    <button onClick={() => setActiveJob(null)} className="text-[12px] font-black bg-white/5 px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest text-gray-400 hover:text-white">
                                        Close Feed
                                    </button>
                                </div>
                            </div>
                        </div>

                        {applicants.length === 0 ? (
                            <div className="py-40 text-center bg-white/5 rounded-[40px] border border-white/5">
                                <p className="text-gray-500 font-bold italic">Checking for new signals...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {applicants
                                    .filter(app => {
                                        const matchesScore = app.matchScore >= filterMatch;
                                        const matchesSkill = !filterSkill || (app.user.skills && app.user.skills.some(s => s.toLowerCase().includes(filterSkill.toLowerCase())));
                                        
                                        let matchesExp = true;
                                        if (filterExperience === 'Required') {
                                            matchesExp = app.resumeMeta?.hasExperience === true;
                                        } else if (filterExperience === 'Fresh') {
                                            matchesExp = app.resumeMeta?.hasExperience === false;
                                        }

                                        return matchesScore && matchesSkill && matchesExp;
                                    })
                                    .sort((a, b) => {
                                        if (filterSort === 'date') return new Date(b.appliedAt) - new Date(a.appliedAt);
                                        return b.matchScore - a.matchScore;
                                    })
                                    .map((app) => (
                                        <div key={app._id} className="card bg-white/5 hover:bg-white/[0.08] border-white/5 group transition-all duration-500 overflow-hidden relative">
                                            {/* Match Score Badge */}
                                            <div className="absolute top-0 right-0 p-4">
                                                <div className={`px-3 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-tighter ${app.matchStatus === 'Strong Match' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                                                    app.matchStatus === 'Medium Match' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' :
                                                        'bg-gray-500/20 border-white/10 text-gray-400'
                                                    }`}>
                                                    {app.matchScore}% Score
                                                </div>
                                            </div>

                                            <div className="flex flex-col h-full">
                                                <div className="mb-8">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-lg">👤</div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{app.matchStatus}</p>
                                                        </div>
                                                    </div>
                                                    <h5 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tighter">{app.user.name}</h5>
                                                    <p className="text-[11px] font-medium text-gray-500 italic mt-1">{app.user.email}</p>

                                                    {/* Candidate Summary */}
                                                    {app.aiSummary && (
                                                        <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Professional Insight</p>
                                                            <p className="text-[11px] text-gray-300 leading-relaxed italic">"{app.aiSummary}"</p>
                                                        </div>
                                                    )}

                                                    {/* Match Justification */}
                                                    {app.justification && (
                                                        <div className="mt-4 p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                                                            <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">Matching Justification</p>
                                                            <p className="text-[11px] text-gray-300 leading-relaxed">{app.justification}</p>
                                                        </div>
                                                    )}

                                                    {/* Score Breakdown */}
                                                    {app.subScores && (
                                                        <div className="mt-4 space-y-2">
                                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Match Breakdown</p>
                                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between text-[8px] font-bold uppercase text-gray-500">
                                                                        <span>Skills</span>
                                                                        <span>{app.subScores.skills}%</span>
                                                                    </div>
                                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-blue-400" style={{ width: `${app.subScores.skills}%` }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between text-[8px] font-bold uppercase text-gray-500">
                                                                        <span>Experience</span>
                                                                        <span>{app.subScores.experience}%</span>
                                                                    </div>
                                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-purple-400" style={{ width: `${app.subScores.experience}%` }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between text-[8px] font-bold uppercase text-gray-500">
                                                                        <span>Keywords</span>
                                                                        <span>{app.subScores.keywordMatch}%</span>
                                                                    </div>
                                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-green-400" style={{ width: `${app.subScores.keywordMatch}%` }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between text-[8px] font-bold uppercase text-gray-500">
                                                                        <span>Education</span>
                                                                        <span>{app.subScores.education}%</span>
                                                                    </div>
                                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-yellow-400" style={{ width: `${app.subScores.education}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Skill Analysis (ATS Based) */}
                                                    <div className="mt-4">
                                                        {app.missingSkills && app.missingSkills.length > 0 ? (
                                                            <div className="space-y-4">
                                                                {app.matchedKeywords && app.matchedKeywords.length > 0 && (
                                                                    <div className="space-y-2">
                                                                        <p className="text-[9px] font-black text-green-400 uppercase tracking-widest">Matched Requirements</p>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {app.matchedKeywords.slice(0, 6).map(skill => (
                                                                                <span key={skill} className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-[9px] font-black text-green-400 rounded-md uppercase tracking-tighter">
                                                                                    {skill}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="space-y-2">
                                                                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Gaps Identified</p>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {app.missingSkills.slice(0, 6).map(skill => (
                                                                            <span key={skill} className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-400 rounded-md uppercase tracking-tighter">
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Key Skills</p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {(app.user.skills || []).slice(0, 6).map(skill => (
                                                                        <span key={skill} className="px-2 py-0.5 bg-white/5 border border-white/5 text-[9px] font-black text-gray-400 rounded-md uppercase tracking-tighter">
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* ATS Profile Strength (Small Section) */}
                                                    {app.resumeMeta && (
                                                        <div className="mt-4 pt-4 border-t border-white/5">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">ATS Profile Strength</p>
                                                                <span className={`text-xs font-black ${(app.resumeMeta.hasExperience ? 25 : 0) + (app.resumeMeta.hasEducation ? 25 : 0) + (app.resumeMeta.hasProjects ? 25 : 0) + ((app.user.skills?.length || 0) >= 5 ? 25 : 0) >= 75 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                                    {(app.resumeMeta.hasExperience ? 25 : 0) + (app.resumeMeta.hasEducation ? 25 : 0) + (app.resumeMeta.hasProjects ? 25 : 0) + ((app.user.skills?.length || 0) >= 5 ? 25 : 0)}/100
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-2 h-2 rounded-full ${app.resumeMeta.hasExperience ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Experience</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-2 h-2 rounded-full ${app.resumeMeta.hasEducation ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Education</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-2 h-2 rounded-full ${app.resumeMeta.hasProjects ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Projects</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-2 h-2 rounded-full ${(app.user.skills?.length || 0) >= 5 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Keywords</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-auto space-y-6">
                                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</p>
                                                            <select
                                                                value={app.status || 'Applied'}
                                                                onChange={(e) => updateStatus(app._id, e.target.value)}
                                                                className={`bg-transparent text-xs font-black uppercase tracking-tighter cursor-pointer focus:outline-none ${app.status === 'Accepted' ? 'text-green-400' :
                                                                    app.status === 'Rejected' ? 'text-red-400' :
                                                                        app.status === 'Shortlisted' ? 'text-purple-400' :
                                                                            app.status === 'Interviewed' ? 'text-yellow-400' :
                                                                                'text-blue-400'
                                                                    }`}
                                                            >
                                                                <option className="bg-slate-900" value="Applied">Applied</option>
                                                                <option className="bg-slate-900" value="Shortlisted">Shortlisted</option>
                                                                <option className="bg-slate-900" value="Interviewed">Mark for Interview</option>
                                                                <option className="bg-slate-900" value="Review Later">Review Later</option>
                                                                <option className="bg-slate-900" value="Rejected">Rejected</option>
                                                            </select>
                                                        </div>
                                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{new Date(app.appliedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    {app.user.resumePath ? (
                                                        <button
                                                            onClick={() => setViewResume(app.user.resumePath)}
                                                            className="block w-full text-center py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 hover:border-blue-500/50 shadow-xl"
                                                        >
                                                            View Resume
                                                        </button>
                                                    ) : (
                                                        <div className="py-4 text-center text-[10px] uppercase tracking-widest text-gray-600 font-black">No Resume</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </section>
                )}
            </div>

            {/* Resume Viewer Modal */}
            {viewResume && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewResume(null)}></div>
                    <div className="relative w-full max-w-6xl h-[85vh] bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Candidate Resume</h3>
                            <div className="flex items-center gap-4">
                                <a
                                    href={`/uploads/${viewResume}?token=${localStorage.getItem('token')}`}
                                    download
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                >
                                    Download PDF
                                </a>
                                <button
                                    onClick={() => setViewResume(null)}
                                    className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#1a1a1a] p-1 relative">
                            {!viewResume.toLowerCase().endsWith('.docx') ? (
                                <object
                                    data={`/uploads/${viewResume}?token=${localStorage.getItem('token')}#toolbar=0&navpanes=0&scrollbar=0`}
                                    type="application/pdf"
                                    className="w-full h-full rounded-xl border border-white/5"
                                >
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                                        <p>Browser unable to embed PDF natively.</p>
                                        <a
                                            href={`/uploads/${viewResume}?token=${localStorage.getItem('token')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold"
                                        >
                                            Open in New Tab
                                        </a>
                                    </div>
                                </object>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                                    <p className="text-xl font-bold">Preview not available for this file type.</p>
                                    <p className="text-sm">Please download to view.</p>
                                    <a
                                        href={`/uploads/${viewResume}?token=${localStorage.getItem('token')}`}
                                        download
                                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold uppercase tracking-widest transition-all"
                                    >
                                        Download File
                                    </a>
                                </div>
                            )}
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

            {/* Delete Confirmation Modal */}
            {jobToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setJobToDelete(null)}></div>
                    <div className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                                <span className="text-3xl filter grayscale contrast-200">🗑️</span>
                            </div>
                            <h3 className="text-2xl font-black text-white italic tracking-tighter">Remove Listing?</h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-black">
                                This will permanently delete '<span className="text-white">{jobToDelete.title}</span>' and remove all associated candidate applications from this pool.
                            </p>

                            <div className="flex gap-4 pt-8">
                                <button
                                    onClick={() => setJobToDelete(null)}
                                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-6 py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 text-xs font-black uppercase tracking-widest rounded-2xl transition-all hover:tracking-[0.2em] shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterDashboard;
