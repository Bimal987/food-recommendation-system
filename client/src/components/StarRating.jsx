import { useState } from 'react';
import { Star } from 'lucide-react';
import PropTypes from 'prop-types';

const StarRating = ({ rating, onRate, readonly = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="star-rating" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating);
                return (
                    <Star
                        key={star}
                        size={20}
                        className={`star ${isFilled ? 'filled' : ''}`}
                        onMouseEnter={() => !readonly && setHoverRating(star)}
                        onClick={() => !readonly && onRate && onRate(star)}
                        style={{ cursor: readonly ? 'default' : 'pointer' }}
                    />
                );
            })}
        </div>
    );
};

StarRating.propTypes = {
    rating: PropTypes.number,
    onRate: PropTypes.func,
    readonly: PropTypes.bool,
};

export default StarRating;
