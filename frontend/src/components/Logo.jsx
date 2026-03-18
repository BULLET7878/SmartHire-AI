import React from 'react';

const Logo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-3.5 ${className} group cursor-pointer`}>
            {/* Ultra-Premium Quantum Icon */}
            <div className="relative">
                {/* Dynamic Neon Glow System */}
                <div className="absolute -inset-3 bg-blue-500/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                
                {/* Main Icon Shell */}
                <div className="relative w-11 h-11 bg-black border border-white/10 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-blue-500/50 shadow-2xl">
                    {/* Animated Data Flows */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-[shimmer_2s_infinite]"></div>
                        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-[shimmer_2.5s_infinite]"></div>
                        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-[shimmer_1.8s_infinite]"></div>
                    </div>

                    {/* Quantum Core SVG */}
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 relative z-10 text-white group-hover:text-blue-400 transition-colors duration-500">
                        {/* Core Hexagon */}
                        <path 
                            d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" 
                            stroke="currentColor" 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        />
                        {/* Connecting Nodes */}
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" className="animate-pulse" />
                        <path d="M12 3V9M12 15V21M4 7.5L9.5 10.5M14.5 13.5L20 16.5M20 7.5L14.5 10.5M9.5 13.5L4 16.5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                    </svg>
                </div>
            </div>
            
            {/* Sophisticated Typeface */}
            <div className="flex flex-col -space-y-1.5">
                <div className="flex items-end">
                    <span className="text-2xl font-black tracking-tighter text-white uppercase italic group-hover:text-white transition-colors duration-500">
                        SMART<span className="text-blue-500 italic drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">HIRE</span>
                    </span>
                </div>
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                    <span className="text-[7.5px] whitespace-nowrap uppercase tracking-[0.5em] font-bold text-white/30 group-hover:text-cyan-400/60 transition-colors">
                        QUANTUM INTELLIGENCE
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Logo;

<style jsx>{`
    @keyframes shimmer {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
    }
`}</style>
