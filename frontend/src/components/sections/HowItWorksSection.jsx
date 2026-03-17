const HowItWorksSection = () => {
    const steps = [
        {
            number: "01",
            title: "Upload or Paste Resume",
            description: "Provide your resume in PDF format or paste the text directly."
        },
        {
            number: "02",
            title: "AI Analyzing",
            description: "Our AI engine analyzes your resume against the target job description or general industry standards."
        },
        {
            number: "03",
            title: "Get Insights",
            description: "Receive structured insights, ATS match score, and actionable recommendations."
        }
    ];

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto relative">
            <div className="text-center space-y-4 mb-20">
                <h2 className="heading-lg">How It Works</h2>
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Connecting Line (Desktop only) */}
                <div className="hidden md:block absolute top-[20%] left-[10%] right-[10%] h-[1px] bg-white/20 z-0"></div>

                {steps.map((step, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-2xl font-bold">
                            {step.number}
                        </div>
                        <h3 className="text-2xl font-semibold">{step.title}</h3>
                        <p className="text-gray-400 max-w-xs">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorksSection;
