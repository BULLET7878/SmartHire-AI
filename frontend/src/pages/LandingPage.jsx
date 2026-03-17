import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import UseCasesSection from '../components/sections/UseCasesSection';
import BeforeAfterSection from '../components/sections/BeforeAfterSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import PreviewSection from '../components/sections/PreviewSection';
import TrustSection from '../components/sections/TrustSection';
import FooterCTA from '../components/sections/FooterCTA';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Optional: If user is already logged in, you might want to redirect them to dashboard,
        // but it's okay for them to see the landing page too.
        // Uncomment below to auto-redirect logged in users to dashboard from the root path.
        /*
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            navigate('/dashboard');
        }
        */
    }, [navigate]);

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-[1440px] flex flex-col items-center">
                <HeroSection />
                <TrustSection />
                <UseCasesSection />
                <BeforeAfterSection />
                <FeaturesSection />
                <HowItWorksSection />
                <PreviewSection />
                <FooterCTA />
            </div>
        </div>
    );
};

export default LandingPage;
