import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/store';
import ClientDashboard from './ClientDashboard';
import FreelancerDashboard from './FreelancerDashboard';

const Dashboard: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div>
                <h2>You are not logged in.</h2>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/register')}>Register</button>
            </div>
        );
    }

    return user.user_type === 'client' ? <ClientDashboard /> : <FreelancerDashboard />;
};

export default Dashboard;
