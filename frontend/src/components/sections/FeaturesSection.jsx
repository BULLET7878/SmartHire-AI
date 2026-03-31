const FeaturesSection = () => {
    const features = [
        {
            title: "AI Resume Analysis",
            description: "Deep natural language processing to extract skills, experience, and format automatically.",
            icon: "🧠"
        },
        {
            title: "ATS Score Generation",
            description: "Instant ATS score evaluating readability, structure, and job-specific relevance.",
            icon: "📊"
        },
        {
            title: "Skill Gap Identification",
            description: "Highlight missing skills and exact keywords needed to improve your application.",
            icon: "🎯"
        },
        {
            title: "Smart Job Matching",
            description: "Instantly compare profiles against active job listings with high accuracy.",
            icon: "💼"
        }
    ];

    return (
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto">

            <div className="text-center space-y-4 mb-16 scroll-reveal">
                <h2 className="heading-lg">Why Choose SmartHire?</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to optimize your resume or find the perfect candidate.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, idx) => (
                    <div key={idx} className={`scroll-reveal delay-${(idx + 1) * 100} card hover:-translate-y-2 transition-transform duration-300 bg-white/5 border border-white/5 p-6 rounded-2xl relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
                        <div className="text-4xl mb-4 relative z-10">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2 relative z-10 text-white">{feature.title}</h3>
                        <p className="text-gray-400 text-base relative z-10 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
