import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.css';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartItemCount } = useCart();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContent}`}>
                <Link to="/" className={styles.logo}>
                    SkensKart
                </Link>

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
