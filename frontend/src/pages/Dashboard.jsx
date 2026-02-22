import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterDashboard from '../components/RecruiterDashboard';
import UserDashboard from '../components/UserDashboard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (!token || !storedUser) {
            navigate('/login');
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
                <h1 className="text-3xl font-bold text-white mb-8">Welcome, {user.name}</h1>

                {user.role === 'RECRUITER' ? <RecruiterDashboard onJobCreated={() => window.location.reload()} /> : <UserDashboard />}
            </div>
        </div>
    );
};

export default Dashboard;
