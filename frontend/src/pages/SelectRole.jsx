import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

const SelectRole = () => {
    const [role, setRole] = useState('USER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const googleToken = location.state?.googleToken;

    // If no google token, redirect to login
    if (!googleToken) {
        navigate('/login');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/google', { token: googleToken, role });
            localStorage.setItem('token', res.data.token);
            const { token, ...userData } = res.data;
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="card border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

                    <div className="relative z-10 text-center">
                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                            <span className="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">One Last Step</span>
                        </div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2">Choose Your Role</h2>
                        <p className="text-gray-500 text-sm mb-10">How will you be using SmartHire AI?</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex gap-4 p-1 bg-black/40 rounded-2xl border border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setRole('USER')}
                                    className={`relative flex-1 py-5 px-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${role === 'USER'
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : 'text-gray-500 hover:text-white'}`}
                                >
                                    {role === 'USER' && <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full -translate-y-1/3 translate-x-1/3 border-2 border-black animate-pulse"></div>}
                                    <div className="text-2xl mb-2">🎓</div>
                                    Candidate
                                    <p className="text-xs font-normal normal-case tracking-normal mt-1 opacity-60">Upload resume, apply to jobs</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('RECRUITER')}
                                    className={`relative flex-1 py-5 px-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${role === 'RECRUITER'
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        : 'text-gray-500 hover:text-white'}`}
                                >
                                    {role === 'RECRUITER' && <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full -translate-y-1/3 translate-x-1/3 border-2 border-black animate-pulse"></div>}
                                    <div className="text-2xl mb-2">👥</div>
                                    Recruiter
                                    <p className="text-xs font-normal normal-case tracking-normal mt-1 opacity-60">Post jobs, find candidates</p>
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-xs font-black uppercase text-red-400 text-center tracking-widest">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.4em] text-xs rounded-xl transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Setting up...' : 'Continue →'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectRole;
