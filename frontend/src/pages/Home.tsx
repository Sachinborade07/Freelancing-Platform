import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/store';
import { useEffect } from 'react';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, initialized } = useAuthStore();

    // Redirect if already authenticated
    useEffect(() => {
        if (initialized && isAuthenticated && user) {
            navigate(user.user_type === 'client' ? '/client' : '/freelancer');
        }
    }, [isAuthenticated, user, initialized, navigate]);

    if (!initialized) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '20px'
        }}>
            <h1>Welcome to Our Platform</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/register')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Home;