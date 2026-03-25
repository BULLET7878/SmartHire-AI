const PreviewSection = () => {
    return (
        <section className="py-24 px-6 w-full flex justify-center">
            <div className="max-w-4xl w-full">
                <div className="text-center space-y-4 mb-16 scroll-reveal">
                    <h2 className="heading-lg">Platform Preview</h2>
                    <p className="text-gray-400">See what our AI identifies from a standard software engineering resume.</p>
                </div>

                <div className="glass rounded-3xl p-8 relative overflow-hidden scroll-reveal-scale">
                    {/* Decorative Background Glows */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-12">
                        {/* Score Card */}
                        <div className="flex-1 space-y-8">
                            <div className="flex flex-col items-center justify-center bg-black/40 rounded-2xl p-8 border border-white/5">
                                <div className="text-gray-400 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">ATS Score Match</div>
                                <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-4 border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.2)] bg-green-500/5">
                                    <span className="text-5xl font-black text-white italic tracking-tighter">82%</span>
                                </div>
                                <div className="mt-6 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] bg-green-500/10 px-6 py-2 rounded-xl border border-green-500/20">
                                    Strong Match
                                </div>
                            </div>

                            {/* Match Breakdown */}
                            <div className="space-y-4 px-2">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Breakdown</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { label: 'Formatting', value: 95, color: 'bg-green-400' },
                                        { label: 'Experience', value: 78, color: 'bg-green-400' },
                                        { label: 'Skills', value: 88, color: 'bg-green-400' },
                                        { label: 'Education', value: 100, color: 'bg-green-400' }
                                    ].map((sub, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <div className="flex justify-between text-[9px] font-bold uppercase text-gray-400 tracking-tighter">
                                                <span>{sub.label}</span>
                                                <span>{sub.value}%</span>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div className={`h-full ${sub.color}`} style={{ width: `${sub.value}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="flex-[1.5] space-y-10">
                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                                        <span>✓</span> Matched Requirements
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['React', 'Node.js', 'JavaScript', 'Tailwind', 'REST APIs', 'Git'].map((skill, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-green-400/10 text-green-300 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-green-500/20">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                                        <span>✕</span> Skill Gaps
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Docker', 'TypeScript', 'AWS S3'].map((skill, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-red-400/10 text-red-200 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-red-500/20">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span>💡</span> AI Matching Insight
                                    </h4>
                                    <p className="text-xs text-gray-400 leading-relaxed italic">
                                        "Candidate shows exceptional frontend mastery and clean code principles. To hit 100%, we recommend adding CI/CD pipelines or cloud infrastructure experience to their next portfolio project."
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-xs">🚀</div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience Detected</p>
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">3+ Years</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PreviewSection;
