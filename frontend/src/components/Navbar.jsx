import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';

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
                <Link to="/" className="hover:opacity-90 transition-opacity">
                    <Logo />
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
