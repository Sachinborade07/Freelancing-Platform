import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/bid';
import { Bid } from '../types/bid';
import { Link } from 'react-router-dom';

const MyBidsPage = () => {
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, user } = useAuth();

    useEffect(() => {
        const fetchBids = async () => {
            try {
                if (user?.user_type === 'freelancer') {
                    const data = await api.getBidsByFreelancer(user.user_id, token!);
                    setBids(data);
                }
            } catch {
                setError('Failed to fetch your bids');
            } finally {
                setLoading(false);
            }
        };

        if (token && user) {
            fetchBids();
        }
    }, [token, user]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>My Bids</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {bids.length === 0 ? (
                <p>You haven't placed any bids yet.</p>
            ) : (
                bids.map((bid) => (
                    <div
                        key={bid.bid_id}
                        style={{
                            border: '1px solid #ccc',
                            padding: '1rem',
                            marginBottom: '1rem',
                            borderRadius: '8px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>
                                {bid.project_title || 'Project'} - ${bid.bid_amount}
                            </strong>
                            <span
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    backgroundColor:
                                        bid.status === 'accepted'
                                            ? 'green'
                                            : bid.status === 'rejected'
                                                ? 'red'
                                                : 'gray',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {bid.status}
                            </span>
                        </div>
                        <p style={{ marginTop: '0.5rem' }}>{bid.proposal}</p>
                        <Link to={`/projects/${bid.project_id}`}>View Project</Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyBidsPage;
