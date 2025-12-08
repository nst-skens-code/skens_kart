import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/currency';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        await addToCart(product.id, 1);
    };

    return (
        <div className={styles.card} onClick={() => navigate(`/products/${product.id}`)}>
            <div className={styles.imageContainer}>
                <img
                    src={product.images[0]?.url || 'https://via.placeholder.com/300'}
                    alt={product.title}
                    className={styles.image}
                />
                {product.inventoryCount < 5 && product.inventoryCount > 0 && (
                    <span className={styles.badge}>Low Stock</span>
                )}
                {product.inventoryCount === 0 && (
                    <span className={styles.badge} style={{ background: 'var(--color-error)' }}>Out of Stock</span>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.category}>{product.category?.name}</div>
                <h3 className={styles.title}>{product.title}</h3>
                <p className={styles.description}>{product.description}</p>

                <div className={styles.footer}>
                    <div className={styles.price}>
                        {formatPrice(product.priceCents)}
                    </div>
                    <button
                        className={styles.addButton}
                        onClick={handleAddToCart}
                        disabled={product.inventoryCount === 0}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
