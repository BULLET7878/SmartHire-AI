import { Link } from 'react-router-dom';

const FooterCTA = () => {
    return (
        <section className="py-24 px-6 w-full flex justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl z-0"></div>
            <div className="max-w-3xl w-full text-center space-y-8 relative z-10 card border border-white/10 p-12 bg-black/40">
                <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
                    Ready to Optimize Your Hiring?
                </h2>
                <p className="text-gray-400 text-lg">
                    Join thousands who have already streamlined their resume review process and found better job matches using SmartHire AI.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link to="/demo" className="btn-primary px-10 h-14 w-full sm:w-auto text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all">
                        Try Demo
                    </Link>
                    <Link to="/register" className="btn-secondary px-10 h-14 w-full sm:w-auto text-lg mt-0">
                        Get Started
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FooterCTA;
