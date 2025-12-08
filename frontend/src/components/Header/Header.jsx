import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartItemCount } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContent}`}>
                <Link to="/" className={styles.logo}>
                    SkensKart
                </Link>

                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Search for products, brands and more"
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className={styles.searchButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </form>

                <nav className={styles.nav}>
                    <Link to="/" className={styles.navLink}>Home</Link>
                    {isAuthenticated ? (
                        <div className={styles.userMenu}>
                            <Link to="/profile" className={styles.userButton}>
                                <span>{user?.name?.split(' ')[0]}</span>
                            </Link>
                            <button onClick={logout} className={styles.navLink} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className={styles.authButton}>Login</Link>
                    )}
                </nav>

                <div className={styles.actions}>
                    <Link to="/cart" className={styles.cartButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        {cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
                        <span style={{ marginLeft: '0.5rem', fontWeight: '500' }}>Cart</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
