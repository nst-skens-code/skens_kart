import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.css';

const Header = () => {
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    const { cartItemCount } = useCart();

    const isActive = (path) => location.pathname === path;

    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.headerContent}>
                    <Link to="/" className={styles.logo}>
                        SkensKart
                    </Link>

                    <nav className={styles.nav}>
                        <Link
                            to="/"
                            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className={`${styles.navLink} ${isActive('/products') ? styles.active : ''}`}
                        >
                            Products
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/orders"
                                className={`${styles.navLink} ${isActive('/orders') ? styles.active : ''}`}
                            >
                                Orders
                            </Link>
                        )}
                    </nav>

                    <div className={styles.actions}>
                        {isAuthenticated && (
                            <Link to="/cart" className={styles.cartButton}>
                                <span>🛒</span>
                                <span>Cart</span>
                                {cartItemCount > 0 && (
                                    <span className={styles.cartBadge}>{cartItemCount}</span>
                                )}
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <div className={styles.userMenu}>
                                <button className={styles.userButton}>
                                    <span>{user?.name}</span>
                                </button>
                                <button onClick={logout} className={styles.authButton}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className={styles.authButton}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
