import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ProductCard from '../components/ProductCard/ProductCard';
import styles from './Home.module.css';

const categories = [
    { id: 'electronics', name: 'Electronics', icon: '🎧' },
    { id: 'clothing', name: 'Fashion', icon: '👕' },
    { id: 'home-garden', name: 'Home', icon: '🏠' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'books', name: 'Books', icon: '📚' },
];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = {};
                if (searchQuery) params.q = searchQuery;

                const response = await api.get('/products', { params });
                setProducts(response.data.data.products);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className={styles.container}>
            {!searchQuery && (
                <>
                    <div className={styles.categoryStrip}>
                        {categories.map((cat) => (
                            <div key={cat.id} className={styles.categoryItem}>
                                <div className={styles.categoryIcon}>{cat.icon}</div>
                                <span className={styles.categoryName}>{cat.name}</span>
                            </div>
                        ))}
                    </div>

                    <motion.section
                        className={styles.hero}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.heroBackground}></div>
                        <div className={styles.heroContent}>
                            <motion.h1
                                className={styles.heroTitle}
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                NEXT GEN <br /> SHOPPING
                            </motion.h1>
                            <p className={styles.heroSubtitle}>
                                Experience the future of e-commerce with our premium collection of tech, fashion, and more.
                            </p>
                            <button className={styles.heroCTA}>
                                Explore Now
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>
                        </div>
                    </motion.section>
                </>
            )}

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Now'}
                    </h2>
                    {!searchQuery && (
                        <button className={styles.viewAll}>
                            View All
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : (
                    <motion.div
                        className={styles.productGrid}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {products.map((product) => (
                            <motion.div key={product.id} variants={itemVariants}>
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>
        </div>
    );
};

export default Home;
