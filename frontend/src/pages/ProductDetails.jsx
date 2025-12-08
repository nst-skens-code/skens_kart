import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data.data);
            } catch (err) {
                setError('Failed to load product details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            setAdding(true);
            await addToCart(product.id, 1);
            // Optional: Show success toast
        } catch (err) {
            console.error('Failed to add to cart:', err);
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div className={styles.loading}>Loading product...</div>;
    if (error) return <div className={styles.loading}>{error}</div>;
    if (!product) return <div className={styles.loading}>Product not found</div>;

    return (
        <div className={styles.container}>
            <div className={styles.productWrapper}>
                <div className={styles.imageContainer}>
                    <img
                        src={product.images[0]?.url || 'https://via.placeholder.com/600'}
                        alt={product.title}
                        className={styles.image}
                    />
                </div>

                <div className={styles.infoContainer}>
                    <div className={styles.category}>{product.category?.name}</div>
                    <h1 className={styles.title}>{product.title}</h1>
                    <div className={styles.price}>
                        ${(product.priceCents / 100).toFixed(2)}
                    </div>

                    <p className={styles.description}>{product.description}</p>

                    <div className={styles.actions}>
                        <button
                            className={styles.addToCartBtn}
                            onClick={handleAddToCart}
                            disabled={adding || product.inventoryCount === 0}
                        >
                            {adding ? 'Adding...' :
                                product.inventoryCount === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>

                    <div className={styles.stockInfo}>
                        {product.inventoryCount > 0
                            ? `${product.inventoryCount} items in stock`
                            : 'Currently unavailable'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
