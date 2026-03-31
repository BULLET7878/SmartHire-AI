const UseCasesSection = () => {
    const cases = [
        {
            audience: "Students",
            action: "Improve Resumes",
            description: "Get early feedback on your resume format and skills before applying for your first internship or full-time role.",
            icon: "🎓"
        },
        {
            audience: "Job Seekers",
            action: "Match with Jobs",
            description: "Instantly see how well your profile aligns with target roles and discover exact keywords missing from your application.",
            icon: "🚀"
        },
        {
            audience: "Recruiters",
            action: "Identify Top Candidates",
            description: "Process hundreds of applications instantly, sort by ATS match scores, and find the perfect candidate faster.",
            icon: "👥"
        }
    ];

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto w-full">
            <div className="text-center space-y-4 mb-16 scroll-reveal">
                <h2 className="heading-lg">Who is it for?</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Tailored solutions for every stage of the hiring process.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cases.map((item, idx) => (
                    <div key={idx} className={`scroll-reveal delay-${(idx + 1) * 100} card bg-white/5 border border-white/5 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group`}>
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-lg">
                            {item.icon}
                        </div>
                        <h3 className="text-base font-black text-gray-500 uppercase tracking-widest mb-2">{item.audience}</h3>
                        <h4 className="text-2xl font-bold text-white mb-4">{item.action}</h4>
                        <p className="text-gray-400 leading-relaxed text-base">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default UseCasesSection;
