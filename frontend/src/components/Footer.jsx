import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-2xl pt-12 pb-8 mt-auto z-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] -z-10 rounded-full"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 blur-[120px] -z-10 rounded-full"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* Brand */}
                    <div className="space-y-5">
                        <Logo />
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            AI-powered resume analysis and smart hiring platform for students, job seekers, and recruiters.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] italic">Quick Links</h4>
                        <ul className="space-y-2.5">
                            <li><Link to="/" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Home</Link></li>
                            <li><Link to="/demo" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Try Demo</Link></li>
                            <li><Link to="/login" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Sign In</Link></li>
                            <li><Link to="/register" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Create Account</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] italic">Contact</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <a href="mailto:rahuldhakad@example.com" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">
                                    Email Support
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/BULLET7878/SmartHire-AI" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">
                                    GitHub Repo
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] text-center md:text-left">
                        &copy; {currentYear} Rahul Dhakad. All rights reserved. Built with ❤️
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
