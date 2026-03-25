const Logo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-3 ${className} cursor-pointer group`}>
            {/* Glass Icon */}
            <div className="relative w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-md shadow-lg group-hover:border-blue-500/40 group-hover:bg-white/10 transition-all duration-300">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    {/* Brain */}
                    <path d="M9 3C7.3 3 6 4.3 6 6C4.7 6 3.5 7.2 3.5 8.5C3.5 9.8 4.3 10.9 5.5 11.4C5.5 13 6.6 14.3 8 14.7V17H10V14.8C11.1 14.5 12 13.6 12 12.5V11C13 11.3 14 10.8 14.5 9.9C15.3 10.1 16.2 9.5 16.5 8.7C17.1 8.4 17.5 7.8 17.5 7C17.5 6 16.7 5.2 15.7 5.1C15.4 3.9 14.3 3 13 3C12 3 11.1 3.5 10.5 4.2C10.1 3.5 9.6 3 9 3Z"
                        stroke="#60a5fa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    {/* Checkmark */}
                    <path d="M8 8.5L9.8 10.5L14 6.5"
                        stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {/* Text */}
            <div className="flex flex-col leading-none">
                <span className="text-white font-black tracking-tight text-base uppercase italic">
                    Smart<span className="text-blue-400">Hire</span> AI
                </span>
                <span className="text-white/30 text-[8px] uppercase tracking-[0.35em] font-semibold mt-0.5">
                    Hire Smarter with AI
                </span>
            </div>
        </div>
    );
};

export default Logo;
