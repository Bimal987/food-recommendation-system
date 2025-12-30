import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ChefHat } from 'lucide-react';

const Header = ({ currentUserId, setUserId }) => {
    const location = useLocation();

    return (
        <header>
            <div className="container nav-content">
                <div className="brand">
                    <ChefHat
                        className="text-accent-primary"
                        color="var(--accent-primary)"
                        size={32}
                    />
                    <h1 className="brand-title">FoodAI</h1>
                </div>

                <nav className="nav-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Browse
                    </Link>
                    <Link
                        to="/recommendations"
                        className={`nav-link ${location.pathname === '/recommendations' ? 'active' : ''}`}
                    >
                        For You
                    </Link>
                </nav>

                <div className="user-input">
                    <label htmlFor="userId">User ID:</label>
                    <input
                        id="userId"
                        type="number"
                        aria-label="User ID"
                        value={currentUserId}
                        onChange={(e) => setUserId(Number(e.target.value))}
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
