import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState('');
    const [isRolling, setIsRolling] = useState(false);
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

    const handleRoleChange = (newRole) => {
        if (newRole !== role) {
            setRole(newRole);
            setIsRolling(true);
            setTimeout(() => setIsRolling(false), 600);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { name, email, password, role });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleGoogleSuccess = async (response) => {
        console.log('--- Google Success Event (Frontend) ---');
        console.log('Credential received from Google:', response.credential ? 'Yes' : 'No');
        try {
            console.log('Sending token to backend /api/auth/google...');
            const res = await api.post('/auth/google', { token: response.credential });
            console.log('Backend response received successfully!');
            localStorage.setItem('token', res.data.token);
            const { token, ...userData } = res.data;
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/dashboard');
        } catch (err) {
            console.error('API Error during Google Auth:', err);
            setError(err.response?.data?.message || 'Google Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 pt-28">
            <div className={`w-full max-w-md transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

                {/* Modern Tech Card */}
                <div className="card shadow-2xl relative overflow-hidden group border border-white/10">
                    {/* Glowing Accent */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

                    <div className="relative z-10">
                        <header className="text-center mb-12">
                            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Create Account</span>
                            </div>
                            <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">Register</h2>
                            <p className="text-gray-500 text-[12px] font-bold uppercase tracking-widest opacity-60">Join the platform</p>
                        </header>

                        <div className={`transition-all duration-700 delay-75 mb-6 flex justify-center ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => console.log('Google Sign In failed')}
                                theme="filled_black"
                                shape="pill"
                                width="100%"
                                text="signup_with"
                            />
                        </div>

                        <div className={`flex items-center gap-4 mb-6 opacity-40 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="flex-1 h-px bg-white/20"></div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">or register with email</span>
                            <div className="flex-1 h-px bg-white/20"></div>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-5">
                                {/* Staggered Inputs */}
                                <div className={`transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="input-field bg-black group-hover:bg-black/80 transition-all border-white/10 active:scale-[0.99] shadow-none"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                        <div className="absolute bottom-0 left-0 w-0 h-px bg-blue-500 transition-all duration-500 group-focus-within:w-full"></div>
                                    </div>
                                </div>

                                <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            placeholder="user@network.com"
                                            className="input-field bg-black group-hover:bg-black/80 transition-all border-white/10 active:scale-[0.99] shadow-none"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <div className="absolute bottom-0 left-0 w-0 h-px bg-blue-500 transition-all duration-500 group-focus-within:w-full"></div>
                                    </div>
                                </div>

                                <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="input-field bg-black group-hover:bg-black/80 transition-all border-white/10 active:scale-[0.99] shadow-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <div className="absolute bottom-0 left-0 w-0 h-px bg-blue-500 transition-all duration-500 group-focus-within:w-full"></div>
                                    </div>
                                </div>

                                <div className={`space-y-3 pt-4 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Select Node Type</label>
                                        <span className="text-[10px] font-bold text-blue-500/50 uppercase tracking-tighter">Required*</span>
                                    </div>
                                    <div className="flex gap-4 p-1 bg-black/40 rounded-2xl border border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => handleRoleChange('USER')}
                                            className={`relative flex-1 py-3 px-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${role === 'USER'
                                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                : 'text-gray-500 hover:text-white'
                                                }`}
                                        >
                                            {role === 'USER' && <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full -translate-y-1/3 translate-x-1/3 border-2 border-black animate-pulse"></div>}
                                            Candidate
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRoleChange('RECRUITER')}
                                            className={`relative flex-1 py-3 px-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${role === 'RECRUITER'
                                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                : 'text-gray-500 hover:text-white'
                                                }`}
                                        >
                                            {role === 'RECRUITER' && <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full -translate-y-1/3 translate-x-1/3 border-2 border-black animate-pulse"></div>}
                                            Recruiter
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-[12px] font-black uppercase text-red-400 text-center tracking-widest animate-pulse">
                                    System Error: {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="group relative w-full h-16 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.4em] text-[12px] rounded-2xl transition-all hover:tracking-[0.5em] hover:bg-white/10 active:scale-[0.97] overflow-hidden shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10"></div>
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Sign Up
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                                </span>
                            </button>
                        </form>

                        <footer className="mt-12 text-center pt-8 border-t border-white/5">
                            <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">
                                Existing Identity? <Link to="/login" className="text-white hover:text-blue-500 transition-colors border-b border-white/20 pb-0.5 ml-1">Login</Link>
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
