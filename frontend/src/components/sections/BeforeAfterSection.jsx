const BeforeAfterSection = () => {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto w-full relative">
            <div className="text-center space-y-4 mb-16 scroll-reveal">
                <h2 className="heading-lg">The SmartHire Impact</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Transform your recruitment and application experience.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Before */}
                <div className="scroll-reveal-left card bg-red-500/5 border-red-500/10 p-8 md:p-10 rounded-[40px] relative overflow-hidden group hover:border-red-500/30 transition-colors duration-500">
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-red-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest mb-10 shadow-lg">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            The Old Way
                        </div>
                        
                        <div className="space-y-8">
                            <div className="flex gap-5 items-start">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0 mt-1 border border-red-500/20 font-bold">✕</div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-300 mb-2">No Resume Feedback</h4>
                                    <p className="text-base text-gray-500 leading-relaxed">Applying blindly without knowing if your resume passes basic ATS screening rules.</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0 mt-1 border border-red-500/20 font-bold">✕</div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-300 mb-2">Random Job Applications</h4>
                                    <p className="text-base text-gray-500 leading-relaxed">Wasting time applying to roles where you lack key required skills or keywords.</p>
                                </div>
                            </div>
                             <div className="flex gap-5 items-start">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0 mt-1 border border-red-500/20 font-bold">✕</div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-300 mb-2">Manual Candidate Filtering</h4>
                                    <p className="text-base text-gray-500 leading-relaxed">Recruiters spending hours reading resumes to find basic keyword matches.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* After */}
                <div className="scroll-reveal-right card bg-green-500/5 border-green-500/10 p-8 md:p-10 rounded-[40px] relative overflow-hidden group hover:border-green-500/30 transition-colors duration-500">
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-green-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-black uppercase tracking-widest mb-10 shadow-lg">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            With SmartHire
                        </div>
                        
                        <div className="space-y-8">
                            <div className="flex gap-5 items-start">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 mt-1 border border-green-500/20 font-bold">✓</div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">Structured ATS Insights</h4>
                                    <p className="text-base text-gray-400 leading-relaxed">Get granular scoring on formatting, keywords, and experience immediately.</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 mt-1 border border-green-500/20 font-bold">✓</div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">Smart Job Matching</h4>
                                    <p className="text-base text-gray-400 leading-relaxed">See exactly which skills you're missing before you even click apply.</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 mt-1 border border-green-500/20 font-bold">✓</div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">Instant Candidate Ranking</h4>
                                    <p className="text-base text-gray-400 leading-relaxed">Recruiters instantly see top candidates sorted by objective match scores.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BeforeAfterSection;
