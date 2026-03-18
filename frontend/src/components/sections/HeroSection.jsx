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
                        <Link to="/login" className="btn-secondary h-14 px-8 flex justify-center items-center text-lg w-full sm:w-auto">
                                Sign In
                            </Link>
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
