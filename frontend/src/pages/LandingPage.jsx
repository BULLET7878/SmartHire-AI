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
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    } else {
                        entry.target.classList.remove('revealed');
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        const els = document.querySelectorAll(
            '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
        );
        els.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
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
