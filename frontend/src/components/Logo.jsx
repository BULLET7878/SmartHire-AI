const Logo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-3.5 ${className} cursor-pointer group`}>
            {/* Geometric SH Monogram */}
            <div className="relative">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 group-hover:scale-110 transition-all duration-500 ease-out drop-shadow-[0_0_12px_rgba(96,165,250,0.4)]">
                    
                    {/* Background Hexagon Glow */}
                    <path 
                        d="M50 5 L89 27.5 V72.5 L50 95 L11 72.5 V27.5 L50 5Z" 
                        className="fill-blue-500/10 stroke-blue-500/30" 
                        strokeWidth="1"
                    />

                    {/* SH geometric lines */}
                    <g fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        {/* Left Vertical of H */}
                        <path d="M30 30 V70" className="group-hover:stroke-blue-400 transition-colors duration-300" strokeWidth="9" />
                        {/* Right Vertical of H */}
                        <path d="M70 30 V70" className="group-hover:stroke-blue-400 transition-colors duration-300" strokeWidth="9" />
                        {/* S shape connecting */}
                        <path d="M30 30 H70 L30 50 H70 L30 70 H70" 
                            className="stroke-blue-400 group-hover:stroke-white transition-colors duration-300"
                            strokeWidth="8"
                        />
                    </g>

                    {/* Accent detail */}
                    <circle cx="50" cy="50" r="2.5" className="fill-blue-400 animate-pulse" />
                </svg>
                
                {/* Outer decorative ring */}
                <div className="absolute inset-0 border border-white/10 rounded-xl rotate-45 scale-75 group-hover:rotate-90 group-hover:scale-100 transition-all duration-700"></div>
            </div>

            <div className="flex flex-col leading-none">
                <span className="text-white font-black tracking-tight text-xl uppercase italic flex items-baseline gap-1">
                    Smart<span className="text-blue-400">Hire</span>
                    <span className="text-[11px] not-italic ml-1 opacity-50 font-medium tracking-normal text-white">AI</span>
                </span>
                <span className="text-white/40 text-[11px] uppercase tracking-[0.35em] font-bold mt-1.5 group-hover:text-blue-400/60 transition-colors">
                    Hire Smarter with AI
                </span>
            </div>
        </div>
    );
};

export default Logo;
