import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import LoginInfoSection from '../components/auth/LoginInfoSection';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if the user came from the demo page
    const fromDemo = location.state?.fromDemo;

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            navigate('/dashboard');
            return;
        }
        setMounted(true);
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            const { token, ...userData } = res.data;
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/dashboard');
        } catch (err) {
            if (!err.response) {
                setError('Network Error: Backend server is unreachable');
            } else {
                setError(err.response?.data?.message || 'Authentication failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 pt-24 pb-24">
            <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
                
                {/* Left Side: Value Proposition & Preview */}
                <LoginInfoSection />

                {/* Right Side: Login Form */}
                <div className="w-full max-w-md flex flex-col items-center">
                    {fromDemo && (
                        <div className="w-full mb-6 p-4 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm rounded-xl text-center animate-in fade-in slide-in-from-top-4">
                            Sign up or log in to save your results and apply for jobs.
                        </div>
                    )}
                    <LoginForm 
                        onLogin={handleLogin}
                        error={error}
                        mounted={mounted}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
