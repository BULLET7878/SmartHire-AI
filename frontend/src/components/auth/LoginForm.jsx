import { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ onLogin, error, mounted, email, setEmail, password, setPassword }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <div className={`w-full max-w-md transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="card border border-white/10 shadow-2xl relative overflow-hidden group">
                {/* Glowing Accent */}
                <div className="absolute top-0 right-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

                <div className="relative z-10">
                    <header className="text-center mb-10">
                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">Login</span>
                        </div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2">Welcome Back</h2>
                        <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest opacity-60">Authorize your secure session</p>
                    </header>

                    <form onSubmit={onLogin} className="space-y-6">
                        <div className="space-y-5">
                            <div className={`transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-white">Email Address</label>
                                <div className="relative group/input">
                                    <input
                                        type="email"
                                        placeholder="user@network.com"
                                        className="input-field bg-black group-hover/input:bg-black/80 transition-all border-white/10 active:scale-[0.99] shadow-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <div className="absolute bottom-0 left-0 w-0 h-px bg-purple-500 transition-all duration-500 group-focus-within/input:w-full"></div>
                                </div>
                            </div>

                            <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-white">Password</label>
                                    <a href="#" className="text-[10px] font-medium text-gray-500 hover:text-purple-400 transition-colors">Forgot Password?</a>
                                </div>
                                
                                <div className="relative group/input">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="input-field bg-black group-hover/input:bg-black/80 transition-all border-white/10 active:scale-[0.99] shadow-none pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm"
                                    >
                                        {showPassword ? '👁' : '👁‍🗨'}
                                    </button>
                                    <div className="absolute bottom-0 left-0 w-0 h-px bg-purple-500 transition-all duration-500 group-focus-within/input:w-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className={`flex items-center justify-between transition-all duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                            <label className="flex items-center gap-2 cursor-pointer group/cb">
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${rememberMe ? 'bg-purple-500 border-purple-500' : 'bg-black border-white/20 group-hover/cb:border-white/40'}`}>
                                    {rememberMe && <span className="text-white text-[10px]">✓</span>}
                                </div>
                                <span className="text-[10px] font-medium text-gray-400 group-hover/cb:text-gray-300">Remember device</span>
                            </label>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-[11px] font-black uppercase text-red-400 text-center tracking-widest animate-in fade-in zoom-in duration-300">
                                {error.includes('credentials') || error.includes('password') || error.includes('email') ? 'Invalid email or password. Please try again.' : error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="group/btn relative w-full h-14 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-xl transition-all hover:tracking-[0.5em] hover:bg-white/10 active:scale-[0.98] overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-purple-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 opacity-20"></div>
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                Secure Login
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                            </span>
                        </button>
                    </form>

                    <footer className="mt-8 text-center pt-6 border-t border-white/5">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            New Identity? <Link to="/register" className="text-white hover:text-purple-500 transition-colors ml-1">Register</Link>
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
