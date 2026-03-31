const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Senior Recruiter @ TechFlow",
            content: "SmartHire AI has completely transformed how we filter resumes. What used to take days now takes minutes, and the ATS matching accuracy is scarily good.",
            avatar: "SC"
        },
        {
            name: "James Wilson",
            role: "Software Engineering Student",
            content: "Before using this, I was getting zero callbacks. The AI scan showed me exactly what was missing. After applying the suggestions, I landed 3 interviews in one week!",
            avatar: "JW"
        },
        {
            name: "Elena Rodriguez",
            role: "Talent Acquisition Lead",
            content: "The match insights are a game changer. It doesn't just give a score; it explains the 'why'. It's like having an expert assistant reviewing every application.",
            avatar: "ER"
        }
    ];

    return (
        <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto w-full">

            <div className="text-center space-y-4 mb-20 scroll-reveal">
                <h2 className="heading-lg">Loved by Teams & Candidates</h2>
                <p className="text-gray-400 max-w-2xl mx-auto tracking-wide">Trusted by industry professionals to bridge the gap between talent and opportunity.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((item, idx) => (
                    <div key={idx} className={`scroll-reveal delay-${(idx + 1) * 100} glass p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between`}>
                        {/* Quote Icon */}
                        <div className="absolute -top-4 -right-4 text-9xl text-white/[0.03] font-serif group-hover:text-purple-500/[0.06] transition-colors pointer-events-none">
                            "
                        </div>

                        <div className="relative z-10">
                            <div className="flex gap-1 mb-6 text-purple-400">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>
                            <p className="text-gray-300 leading-relaxed italic text-sm mb-8">"{item.content}"</p>
                        </div>

                        <div className="flex items-center gap-4 pt-6 border-t border-white/5 relative z-10">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-white border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                <span className="font-black text-xs uppercase tracking-tighter">{item.avatar}</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm tracking-tight">{item.name}</h4>
                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{item.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsSection;
