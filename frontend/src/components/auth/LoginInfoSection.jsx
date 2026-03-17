import { Link } from 'react-router-dom';

const LoginInfoSection = () => {
    return (
        <div className="flex-1 flex flex-col justify-center space-y-10 lg:pr-12 text-center lg:text-left mb-12 lg:mb-0">
            <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-2">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">SmartHire AI</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-tight">
                    AI-Powered <br className="hidden lg:block"/>
                    Resume Analyzer
                </h1>
                <p className="text-gray-400 max-w-md mx-auto lg:mx-0 leading-relaxed">
                    Get ATS scores, identify skill gaps, and match with the right jobs instantly using advanced natural language processing.
                </p>
            </div>

            <div className="space-y-4 max-w-sm mx-auto lg:mx-0">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">🧠</div>
                    <span className="font-medium">Deep AI Resume Analysis</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">📊</div>
                    <span className="font-medium">Instant ATS Scoring</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">🎯</div>
                    <span className="font-medium">Skill Gap Detection</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">💼</div>
                    <span className="font-medium">Smart Job Matching</span>
                </div>
            </div>

            {/* Simulated Insight Card */}
            <div className="card max-w-md w-full mx-auto lg:mx-0 p-8 relative overflow-hidden bg-white/[0.03] border-white/5 shadow-2xl group/card">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover/card:bg-blue-500/20 transition-all duration-700"></div>
                
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Analysis Result</span>
                            <span className="text-xl font-black text-white italic tracking-tighter">Candidate Fit</span>
                        </div>
                        <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-lg font-black italic shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                            82%
                        </div>
                    </div>
                    
                    {/* Tiny Match Breakdown */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {[
                            { label: 'Formatting', value: 95, color: 'bg-green-400' },
                            { label: 'Experience', value: 78, color: 'bg-green-400' },
                            { label: 'Skills', value: 88, color: 'bg-green-400' },
                            { label: 'Education', value: 100, color: 'bg-green-400' }
                        ].map((sub, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-[8px] font-black uppercase text-gray-500 tracking-tighter">
                                    <span>{sub.label}</span>
                                    <span>{sub.value}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${sub.color}`} style={{ width: `${sub.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-[9px] font-black rounded uppercase text-green-400">React Expert</span>
                            <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-[9px] font-black rounded uppercase text-blue-400">Full Stack</span>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-gray-400 italic leading-relaxed">"Strong technical alignment. Focus on cloud infrastructure to unlock senior-level matching."</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <p className="text-xs text-gray-400 mb-4">Want to see it in action without an account?</p>
                <Link to="/demo" className="inline-flex items-center justify-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all hover:border-blue-500/50">
                    Continue as Guest / Try Demo
                </Link>
            </div>
        </div>
    );
};

export default LoginInfoSection;
