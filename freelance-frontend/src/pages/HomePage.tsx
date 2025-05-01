import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ClientProjects from './ClientsProject';

const HomePage = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Welcome to Freelance Platform</h1>
            {isAuthenticated ? (
                <>
                    <h2>Hello, {user?.username}!</h2>
                    <p>You are logged in as a {user?.user_type}.</p>
                    {user?.user_type === 'client' ? (
                        <>
                            <Link to="/projects/create">
                                <button style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                                    Create New Project
                                </button>
                            </Link>
                            <ClientProjects /> {/* ✅ renders project list for clients */}
                        </>
                    ) : (
                        <Link to="/projects">
                            <button style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                                Browse Projects
                            </button>
                        </Link>
                    )}
                </>
            ) : (
                <>
                    <h2>Join our platform today</h2>
                    <p>Find the perfect freelancer for your project or get hired for your skills.</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Link to="/register">
                            <button style={{ padding: '0.5rem 1rem' }}>Register</button>
                        </Link>
                        <Link to="/login">
                            <button style={{ padding: '0.5rem 1rem', border: '1px solid black', background: 'white' }}>
                                Login
                            </button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default HomePage;
