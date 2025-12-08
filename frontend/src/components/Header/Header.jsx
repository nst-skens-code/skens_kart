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
                    <span className={styles.logoIcon}>⚡</span>
                    SkensKart
                </Link>

                <div className={styles.rightSection}>
                    <nav className={styles.nav}>
                        <Link to="/" className={styles.navLink}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            <span>Home</span>
                        </Link>

                        {isAuthenticated ? (
                            <div className={styles.userMenu}>
                                <Link to="/profile" className={styles.navLink}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    <span>{user?.name?.split(' ')[0]}</span>
                                </Link>
                                <button onClick={logout} className={styles.iconButton} title="Logout">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className={styles.navLink}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                                <span>Login</span>
                            </Link>
                        )}
                    </nav>

                    <div className={styles.divider}></div>

                    <div className={styles.actions}>
                        <Link to="/cart" className={styles.cartButton}>
                            <div className={styles.cartIconWrapper}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                {cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
                            </div>
                            <span className={styles.cartText}>My Cart</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
