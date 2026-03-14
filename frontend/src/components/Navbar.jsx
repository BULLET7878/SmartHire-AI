import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="text-lg font-semibold tracking-tight flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
                    {/* Robot Logo */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
                        <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 7V11" stroke="currentColor" strokeWidth="2" />
                        <line x1="9" y1="16" x2="9.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="15" y1="16" x2="15.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M2 13L4 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 13L22 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>SmartHire AI</span>
                </Link>

                <div className="flex items-center gap-6 text-sm font-medium">
                    {!token ? (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Log in</Link>
                            <Link to="/register" className="bg-white/5 border border-white/10 text-white px-5 py-2 rounded-xl hover:bg-white/10 hover:border-blue-500/50 transition-all font-black uppercase text-[10px] tracking-widest shadow-xl">Sign up</Link>
                        </>
                    ) : (
                        <>
                            <>
                                {/* User User */}
                                <span className="text-white font-medium">
                                    <span className="opacity-70">Welcome,</span> {user?.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="ps-4 text-gray-300 hover:text-white transition-colors"
                                >
                                    Log out
                                </button>
                            </>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
