import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            navigate('/dashboard');
        }
    }, [navigate]);
    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center pt-20">
            <div className="max-w-3xl space-y-10 animate-in fade-in zoom-in duration-700">
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
                        Match talent <br />
                        <span className="gradient-text">with precision.</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                        AI-driven resume analysis and job matching for modern recruitment. Simple, fast, and effectively designed for the future of hiring.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link to="/register" className="btn-primary h-14 px-8 flex items-center text-lg w-full sm:w-auto shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30 hover:-translate-y-1">
                        Get Started
                    </Link>
                    <Link to="/login" className="btn-secondary h-14 px-8 flex items-center text-lg w-full sm:w-auto hover:-translate-y-1">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
