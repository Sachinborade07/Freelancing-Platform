import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/bid';
import { Bid } from '../types/bid';

interface BidListProps {
    projectId: number;
}

const BidList = ({ projectId }: BidListProps) => {
    const [bids, setBids] = useState<Bid[]>([]);
    const [bidAmount, setBidAmount] = useState('');
    const [proposal, setProposal] = useState('');
    const { token, user } = useAuth();

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const data = await api.getBidsForProject(projectId, token!);
                setBids(data);
            } catch { }
        };

        if (token) fetchBids();
    }, [projectId, token]);

    const handleSubmitBid = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newBid = await api.createBid(
                {
                    project_id: projectId,
                    bid_amount: Number(bidAmount),
                    proposal,
                },
                token!
            );
            setBids([...bids, newBid]);
            setBidAmount('');
            setProposal('');
        } catch { }
    };

    const handleAcceptBid = async (bidId: number) => {
        try {
            const updatedBid = await api.updateBidStatus(bidId, 'accepted', token!);
            setBids(bids.map((bid) => (bid.bid_id === bidId ? updatedBid : bid)));
        } catch { }
    };

    return (
        <div>
            <h2>Bids</h2>

            {user?.user_type === 'freelancer' && (
                <form onSubmit={handleSubmitBid}>
                    <input
                        type="number"
                        placeholder="Bid Amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Proposal"
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                        required
                    />
                    <button type="submit">Submit Bid</button>
                </form>
            )}

            {bids.length === 0 ? (
                <p>No bids yet</p>
            ) : (
                bids.map((bid) => (
                    <div key={bid.bid_id}>
                        <p>
                            ${bid.bid_amount} by {bid.freelancer_username || 'Freelancer'} - {bid.status}
                        </p>
                        <p>{bid.proposal}</p>
                        {user?.user_type === 'client' && bid.status === 'submitted' && (
                            <button onClick={() => handleAcceptBid(bid.bid_id)}>Accept Bid</button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default BidList;
