const TrustSection = () => {
    return (
        <section className="py-16 px-6 w-full flex justify-center border-y border-white/5 bg-white/[0.02]">
            <div className="max-w-4xl w-full text-center space-y-8">
                <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
                    Designed to assist students and recruiters in making better hiring decisions
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-gray-500">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-white italic">10k+</span>
                        <span className="text-xs font-bold uppercase tracking-widest mt-1">Analyses Performed</span>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-white/10"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-white italic">4.9/5</span>
                        <span className="text-xs font-bold uppercase tracking-widest mt-1">User Satisfaction</span>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-white/10"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-white italic">90%</span>
                        <span className="text-xs font-bold uppercase tracking-widest mt-1">Match Accuracy</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
