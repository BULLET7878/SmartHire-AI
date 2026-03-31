import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-2xl pt-12 pb-6 mt-auto z-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] -z-10 rounded-full"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 blur-[120px] -z-10 rounded-full"></div>

            <div className="max-w-7xl mx-auto px-6 space-y-10">

                {/* Top: Brand + Links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4">
                        <Logo />
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            AI-powered resume analysis and smart hiring platform built for students, job seekers, and recruiters. Analyze resumes, identify skill gaps, and match with the right opportunities.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-full">AI Powered</span>
                            <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-black uppercase tracking-widest rounded-full">ATS Ready</span>
                            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-full">Free Demo</span>
                        </div>
                    </div>

                    {/* Platform */}
                    <div className="space-y-4">
                        <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Home</Link></li>
                            <li><Link to="/demo" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Try Demo</Link></li>
                            <li><Link to="/register" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Create Account</Link></li>
                            <li><Link to="/login" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Sign In</Link></li>
                            <li><Link to="/dashboard" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Contact</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="mailto:support@smarthire.ai" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">
                                    support@smarthire.ai
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/BULLET7878/SmartHire-AI" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">
                                    GitHub Repository
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Stats Strip */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5">
                    <div className="text-center">
                        <div className="text-2xl font-black text-white italic">10k+</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">Analyses Done</div>
                    </div>
                    <div className="text-center border-x border-white/5">
                        <div className="text-2xl font-black text-white italic">90%</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">Match Accuracy</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white italic">4.9/5</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">User Rating</div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] text-center md:text-left">
                        &copy; {currentYear} Rahul Dhakad. All rights reserved. Built with ❤️
                    </p>
                    <p className="text-gray-700 text-[10px] font-black uppercase tracking-widest">
                        Powered by Gemini AI
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
