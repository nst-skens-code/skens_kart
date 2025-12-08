import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../utils/currency';
import api from '../utils/api';
import styles from './Profile.module.css';

const Profile = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data.data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDING': return styles.statusPending;
            case 'PROCESSING': return styles.statusProcessing;
            case 'SHIPPED': return styles.statusShipped;
            case 'DELIVERED': return styles.statusDelivered;
            case 'CANCELLED': return styles.statusCancelled;
            default: return '';
        }
    };

    if (loading) return <div className={styles.loading}>Loading profile...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Profile</h1>
                <div className={styles.email}>{user?.email}</div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Order History</h2>

                {orders.length === 0 ? (
                    <div className={styles.emptyState}>
                        You haven't placed any orders yet.
                    </div>
                ) : (
                    <div className={styles.ordersList}>
                        {orders.map((order) => (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <div>
                                        <div className={styles.orderId}>Order #{order.id.slice(0, 8)}</div>
                                        <div className={styles.orderDate}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className={styles.orderBody}>
                                    <div className={styles.orderItems}>
                                        {order.items.map((item) => (
                                            <div key={item.id} className={styles.orderItem}>
                                                <div className={styles.itemInfo}>
                                                    <img
                                                        src={item.product.images[0]?.url || 'https://via.placeholder.com/60'}
                                                        alt={item.product.title}
                                                        className={styles.itemImage}
                                                    />
                                                    <div>
                                                        <div className={styles.itemName}>{item.product.title}</div>
                                                        <div className={styles.itemMeta}>
                                                            Qty: {item.quantity} × {formatPrice(item.unitPriceCents)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.itemTotal}>
                                                    {formatPrice(item.unitPriceCents * item.quantity)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.orderFooter}>
                                    <span className={styles.totalLabel}>Total Amount</span>
                                    <span className={styles.totalAmount}>
                                        {formatPrice(order.totalCents)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
