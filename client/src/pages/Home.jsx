import { useEffect, useState } from 'react';
import { fetchFoods } from '../services/api';
import FoodCard from '../components/FoodCard';

const Home = ({ userId }) => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFoods = async () => {
            try {
                const data = await fetchFoods();
                setFoods(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadFoods();
    }, []);

    if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Loading...</div>;
    if (error) return <div className="container" style={{paddingTop: '2rem', color: 'red'}}>Error: {error}</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Browse Menu</h2>
            {foods.length === 0 ? (
                <p>No food items found.</p>
            ) : (
                <div className="grid-auto-fit">
                    {foods.map(food => (
                        <FoodCard key={food.id} food={food} userId={userId} />
                    ))}
                </div>
            )}
        </div>
    );
};

import PropTypes from 'prop-types';
Home.propTypes = {
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Home;
