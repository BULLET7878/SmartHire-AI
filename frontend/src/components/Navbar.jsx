import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsDropdownOpen(false);
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="hover:opacity-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    <Logo />
                </Link>

                <div className="flex items-center gap-6">
                    {/* Main Nav Links */}
                    <div className="hidden md:flex items-center gap-8 mr-4">
                        <Link to="/demo" className="relative group px-1 py-1 overflow-hidden transition-all duration-300">
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-white/70 group-hover:text-white transition-all">Try Demo</span>
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </Link>
                    </div>

                    {/* Profile Section */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="group flex items-center gap-3 p-1.5 pl-3 rounded-full bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 active:scale-95"
                        >
                            {!token ? (
                                <span className="text-xs font-black uppercase tracking-widest text-gray-300 group-hover:text-white">Account</span>
                            ) : (
                                <span className="text-xs font-black uppercase tracking-widest text-gray-300 group-hover:text-white hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                            )}
                            
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 flex items-center justify-center text-white overflow-hidden shadow-lg group-hover:shadow-purple-500/20 transition-all">
                                {token ? (
                                    <span className="font-black text-xs uppercase tracking-tighter">
                                        {user?.name?.charAt(0) || 'U'}
                                    </span>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                )}
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-white/5">
                                <div className="p-4 border-b border-white/5 bg-white/5">
                                    <p className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-1">Status</p>
                                    <p className="text-white font-bold text-sm tracking-tight">{token ? user?.name : 'Guest User'}</p>
                                    <p className="text-gray-500 text-xs font-medium">{token ? user?.email : 'Not signed in'}</p>
                                </div>
                                
                                <div className="p-2">
                                    {!token ? (
                                        <>
                                            <Link 
                                                to="/login" 
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/></svg>
                                                Login
                                            </Link>
                                            <Link 
                                                to="/register" 
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 hover:bg-purple-500/5 rounded-xl transition-all"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                                                Create Account
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link 
                                                to="/dashboard" 
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                                Dashboard
                                            </Link>
                                            <button 
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                                                Log Out
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
