import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            navigate('/dashboard');
            return;
        }
        setMounted(true);
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            const { token, ...userData } = res.data;
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 pt-28">
            <div className={`w-full max-w-md transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

                {/* Modern Tech Card */}
                <div className="card tech-border animate-scanline shadow-2xl relative overflow-hidden group">
                    {/* Glowing Accent */}
                    <div className="absolute top-0 right-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

                    <div className="relative z-10">
                        <header className="text-center mb-12">
                            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">Auth Protocol: Secure</span>
                            </div>
                            <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">Welcome Back</h2>
                            <p className="text-gray-500 text-[12px] font-bold uppercase tracking-widest opacity-60">Authentication Required to Proceed</p>
                        </header>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-5">
                                <div className={`transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-white">Access: Email</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            placeholder="user@network.com"
                                            className="input-field bg-black group-hover:bg-black/80 transition-all border-white/10 active:scale-[0.99] shadow-none"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <div className="absolute bottom-0 left-0 w-0 h-px bg-purple-500 transition-all duration-500 group-focus-within:w-full"></div>
                                    </div>
                                </div>

                                <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-white">Access: Passkey</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="input-field bg-black group-hover:bg-black/80 transition-all border-white/10 active:scale-[0.99] shadow-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <div className="absolute bottom-0 left-0 w-0 h-px bg-purple-500 transition-all duration-500 group-focus-within:w-full"></div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-[12px] font-black uppercase text-red-400 text-center tracking-widest animate-pulse">
                                    Auth Error: {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="group relative w-full h-16 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.4em] text-[12px] rounded-2xl transition-all hover:tracking-[0.5em] hover:bg-white/10 active:scale-[0.97] overflow-hidden shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-purple-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10"></div>
                                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent"></span>
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Initiate Login
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></div>
                                </span>
                            </button>
                        </form>

                        <footer className="mt-12 text-center pt-8 border-t border-white/5">
                            <p className="text-gray-600 text-[11px] font-black uppercase tracking-widest">
                                New Identity? <Link to="/register" className="text-white hover:text-purple-500 transition-colors border-b border-white/20 pb-0.5 ml-1">Register</Link>
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
