import PropTypes from 'prop-types';
import StarRating from './StarRating';
import { useState } from 'react';
import { submitRating } from '../services/api';

const FoodCard = ({ food, userId, onRatingSubmit }) => {
    // Local state to show immediate feedback, though parent might refresh
    const [currentRating, setCurrentRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleRate = async (rating) => {
        if (!userId) {
            alert("Please select a user ID first!");
            return;
        }
        setLoading(true);
        try {
            await submitRating(userId, food.id, rating);
            setCurrentRating(rating);
            if (onRatingSubmit) onRatingSubmit();
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Failed to save rating");
        } finally {
            setLoading(false);
        }
    };

    // If food has a 'matchScore' (from recommendations), verify display
    const matchPercent = food.matchScore ? Math.round(food.matchScore * 100) : null;

    return (
        <div className="card animate-fade-in">
            {/* Placeholder for real image if available, else decorative div */}
            <div style={{ 
                height: '160px', 
                backgroundColor: '#334155', 
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                overflow: 'hidden'
            }}>
                {food.image_url ? (
                     <img src={food.image_url} alt={food.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                    <span>No Image</span>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {food.name}
                </h3>
                {matchPercent !== null && (
                    <span style={{ 
                        background: 'var(--accent-primary)', 
                        color: 'white', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold' 
                    }}>
                        {matchPercent}% Match
                    </span>
                )}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem',  height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {food.category || "General"} • {food.cuisine || "International"}
            </p>

            <div style={{ marginTop: 'auto' }}>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                    {loading ? 'Saving...' : 'Rate this:'}
                </p>
                <StarRating rating={currentRating} onRate={handleRate} />
            </div>
            
            {food.tags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '1rem' }}>
                    {food.tags.map(tag => (
                        <span key={tag} style={{ 
                            fontSize: '0.7rem', 
                            background: 'rgba(255,255,255,0.05)', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            color: '#94a3b8'
                        }}>
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

FoodCard.propTypes = {
    food: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.string,
        cuisine: PropTypes.string,
        image_url: PropTypes.string,
        matchScore: PropTypes.number,
        tags: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onRatingSubmit: PropTypes.func
};

export default FoodCard;
