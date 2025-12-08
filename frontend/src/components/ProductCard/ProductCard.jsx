import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const formatPrice = (cents) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await addToCart(product.id, 1);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    const handleCardClick = () => {
        navigate(`/products/${product.id}`);
    };

    const getStockStatus = () => {
        if (product.inventoryCount === 0) return { text: 'Out of stock', className: styles.out };
        if (product.inventoryCount < 10) return { text: `Only ${product.inventoryCount} left`, className: styles.low };
        return { text: 'In stock', className: '' };
    };

    const stockStatus = getStockStatus();

    return (
        <motion.div
            className={styles.card}
            onClick={handleCardClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <div className={styles.imageContainer}>
                <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                    alt={product.images?.[0]?.altText || product.title}
                    className={styles.image}
                />
                {product.category && (
                    <div className={styles.badge}>{product.category.name}</div>
                )}
            </div>

            <div className={styles.content}>
                {product.category && (
                    <div className={styles.category}>{product.category.name}</div>
                )}

                <h3 className={styles.title}>{product.title}</h3>

                <p className={styles.description}>{product.description}</p>

                <div className={styles.footer}>
                    <div>
                        <div className={styles.price}>{formatPrice(product.priceCents)}</div>
                        <div className={`${styles.stock} ${stockStatus.className}`}>
                            {stockStatus.text}
                        </div>
                    </div>

                    {product.inventoryCount > 0 && (
                        <motion.button
                            className={styles.addButton}
                            onClick={handleAddToCart}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>🛒</span>
                            <span>Add</span>
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
