import { useAuthStore } from '../auth/store';

const FreelancerDashboard = () => {
    const { user, logout } = useAuthStore();

    return (
        <div style={{ padding: '20px' }}>
            <h1>Freelancer Dashboard</h1>
            <p>Welcome, {user?.username}!</p>
            <button
                onClick={logout}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default FreelancerDashboard;