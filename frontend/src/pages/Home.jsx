import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ProductCard from '../components/ProductCard/ProductCard';
import styles from './Home.module.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await api.get('/products?limit=8');
                setFeaturedProducts(response.data.data.products);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const features = [
        {
            icon: '🚚',
            title: 'Free Shipping',
            description: 'Free shipping on orders over $50'
        },
        {
            icon: '🔒',
            title: 'Secure Payment',
            description: 'Your payment information is safe'
        },
        {
            icon: '↩️',
            title: 'Easy Returns',
            description: '30-day return policy'
        },
        {
            icon: '💬',
            title: '24/7 Support',
            description: 'Dedicated customer support'
        }
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground} />
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className={styles.heroTitle}>
                        Welcome to SkensKart
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Discover amazing products at unbeatable prices. Shop the latest trends and enjoy a premium shopping experience.
                    </p>
                    <Link to="/products" className={styles.heroCTA}>
                        <span>Shop Now</span>
                        <span>→</span>
                    </Link>
                </motion.div>
            </section>

            {/* Featured Products */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Featured Products</h2>
                        <Link to="/products" className={styles.viewAll}>
                            <span>View All</span>
                            <span>→</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>Loading products...</div>
                    ) : (
                        <motion.div
                            className={styles.productGrid}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {featuredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Features */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.features}>
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className={styles.feature}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className={styles.featureIcon}>{feature.icon}</div>
                                <h3 className={styles.featureTitle}>{feature.title}</h3>
                                <p className={styles.featureDescription}>{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
