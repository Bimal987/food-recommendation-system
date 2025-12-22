import { useEffect, useState } from 'react';
import { fetchRecommendations } from '../services/api';
import FoodCard from '../components/FoodCard';

const Recommendations = ({ userId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRecs = async () => {
            setLoading(true);
            try {
                const data = await fetchRecommendations(userId);
                setRecommendations(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (userId) {
            loadRecs();
        }
    }, [userId]);

    const refreshRecs = () => {
        // Optional: Re-fetch after a rating action if strictly needed, 
        // but for now we trust the flow or let user refresh.
        // Ideally, we could re-fetch here if we wanted immediate update of recs.
    };

    if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Finding the best food for you...</div>;
    if (error) return <div className="container" style={{paddingTop: '2rem', color: 'red'}}>Error: {error}</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span role="img" aria-label="sparkles">✨</span> Verified Picks for You
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Based on your taste and what's popular.</p>
            
            {recommendations.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px' }}>
                    <p>No recommendations yet! Rate some items on the Browse page to get started.</p>
                </div>
            ) : (
                <div className="grid-auto-fit">
                    {recommendations.map(food => (
                        <FoodCard key={food.id} food={food} userId={userId} onRatingSubmit={refreshRecs} />
                    ))}
                </div>
            )}
        </div>
    );
};

import PropTypes from 'prop-types';
Recommendations.propTypes = {
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Recommendations;
