import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ChefHat } from 'lucide-react';

const Header = ({ currentUserId, setUserId }) => {
    const location = useLocation();

    return (
        <header>
            <div className="container nav-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ChefHat className="text-accent-primary" color="var(--accent-primary)" size={32} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        FoodAI
                    </h1>
                </div>

                <nav className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        Browse
                    </Link>
                    <Link to="/recommendations" className={`nav-link ${location.pathname === '/recommendations' ? 'active' : ''}`}>
                        For You
                    </Link>
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>User ID:</label>
                    <input 
                        type="number" 
                        value={currentUserId} 
                        onChange={(e) => setUserId(e.target.value)}
                        style={{ 
                            background: 'rgba(0,0,0,0.2)', 
                            border: '1px solid var(--border-color)', 
                            color: 'white', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            width: '60px'
                        }}
                    />
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setUserId: PropTypes.func.isRequired,
};

export default Header;
