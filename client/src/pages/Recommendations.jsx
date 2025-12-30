import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fetchRecommendations } from '../services/api';
import FoodCard from '../components/FoodCard';

const Recommendations = ({ userId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadRecs = useCallback(async (isRefresh = false) => {
        if (!userId) return;

        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);

        try {
            const data = await fetchRecommendations(userId);
            setRecommendations(data);
        } catch (err) {
            setError(err?.message || 'Something went wrong');
        } finally {
            isRefresh ? setRefreshing(false) : setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadRecs(false);
    }, [loadRecs]);

    const refreshRecs = () => loadRecs(true);

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Finding the best food for you...</div>;
    if (error) return <div className="container" style={{ paddingTop: '2rem', color: 'red' }}>Error: {error}</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span role="img" aria-label="sparkles">✨</span> Verified Picks for You
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Based on your taste and what's popular.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={refreshRecs}
                    disabled={refreshing}
                    style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        color: 'white',
                        cursor: refreshing ? 'not-allowed' : 'pointer',
                        opacity: refreshing ? 0.7 : 1,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {refreshing ? 'Refreshing…' : 'Refresh'}
                </button>
            </div>

            {recommendations.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px' }}>
                    <p>No recommendations yet! Rate some items on the Browse page to get started.</p>
                </div>
            ) : (
                <div className="grid-auto-fit">
                    {recommendations.map(food => (
                        <FoodCard
                            key={food.id}
                            food={food}
                            userId={userId}
                            onRatingSubmit={refreshRecs}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

Recommendations.propTyp
