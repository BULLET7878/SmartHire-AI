import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center pt-20">
            <div className="max-w-4xl space-y-10 animate-in fade-in zoom-in duration-700">
                <div className="space-y-6">
                    <h1 className="heading-xl">
                        AI-Powered Resume Analyzer & <br />
                        <span className="gradient-text">Smart Hiring Platform</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                        Analyze resumes, identify skill gaps, and match with relevant job opportunities using AI.
                    </p>
                    <p className="text-xs md:text-sm text-blue-400 font-black tracking-[0.2em] uppercase mt-2">
                        Built for students, job seekers, and recruiters
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3 pt-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                        <Link to="/demo" className="btn-primary h-14 px-8 flex items-center justify-center text-lg w-full sm:w-auto shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30">
                            Try Demo ✨
                        </Link>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <Link to="/login" className="btn-secondary h-14 px-8 flex flex-1 sm:flex-none justify-center items-center text-lg w-full sm:w-auto">
                                Sign In
                            </Link>
                            <a 
                                href="https://github.com/BULLET7878/SmartHire-AI" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn-secondary h-14 px-8 flex flex-1 sm:flex-none justify-center items-center text-lg w-full sm:w-auto gap-3 group"
                            >
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                                GitHub
                            </a>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-2 bg-white/5 py-1 px-3 rounded-full border border-white/5">No signup required for demo</p>
                </div>
            </div>

            {/* Enhanced Scroll Down Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-default hidden md:flex group">
                {/* Visual Pulse Background */}
                <div className="absolute inset-0 w-12 h-24 -top-6 -left-3 bg-blue-500/20 rounded-full blur-2xl animate-indicator-pulse"></div>
                
                <div className="relative flex flex-col items-center gap-1">
                    {/* Mouse Icon with animated wheel */}
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1.5 backdrop-blur-md bg-white/5 mb-2 group-hover:border-blue-400/50 transition-colors">
                        <div className="w-1 h-2 bg-blue-400 rounded-full animate-scroll-inner"></div>
                    </div>
                    
                    {/* Cascading Arrows */}
                    <div className="flex flex-col items-center -space-y-2">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-blue-400 animate-arrow-cascade" style={{ animationDelay: '0s' }}>
                            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-blue-400/60 animate-arrow-cascade" style={{ animationDelay: '0.2s' }}>
                            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-blue-400/30 animate-arrow-cascade" style={{ animationDelay: '0.4s' }}>
                            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>

                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40 mt-3 group-hover:text-blue-400 transition-colors duration-500">
                        Scroll <span className="text-blue-500/50">Down</span>
                    </span>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
