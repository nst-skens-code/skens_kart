import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currency';
import api from '../utils/api';
import styles from './Cart.module.css';
import { useState } from 'react';

const Cart = () => {
    const { cart, loading, updateCartItem, removeCartItem, refreshCart } = useCart();
    const navigate = useNavigate();
    const [checkingOut, setCheckingOut] = useState(false);

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateCartItem(itemId, newQuantity);
    };

    const handleCheckout = async () => {
        try {
            setCheckingOut(true);
            await api.post('/orders/checkout');
            await refreshCart(); // Cart should be empty now
            navigate('/profile'); // Redirect to profile to see orders
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed. Please try again.');
        } finally {
            setCheckingOut(false);
        }
    };

    if (loading) return <div className={styles.emptyCart}>Loading cart...</div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Shopping Cart</h1>
                <div className={styles.emptyCart}>
                    <p>Your cart is empty</p>
                    <button
                        className={styles.checkoutBtn}
                        style={{ marginTop: '2rem', width: 'auto' }}
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Shopping Cart</h1>

            <div className={styles.cartGrid}>
                <div className={styles.itemsList}>
                    {cart.items.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                            <img
                                src={item.product.images[0]?.url || 'https://via.placeholder.com/100'}
                                alt={item.product.title}
                                className={styles.itemImage}
                            />

                            <div className={styles.itemInfo}>
                                <h3 className={styles.itemName}>{item.product.title}</h3>
                                <div className={styles.itemPrice}>
                                    {formatPrice(item.unitPriceCents)}
                                </div>

                                <div className={styles.quantityControls}>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className={styles.removeBtn}
                                    onClick={() => removeCartItem(item.id)}
                                >
                                    Remove
                                </button>
                            </div>

                            <div className={styles.itemTotal}>
                                {formatPrice(item.unitPriceCents * item.quantity)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.summary}>
                    <h2 className={styles.summaryTitle}>Order Summary</h2>

                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>{formatPrice(cart.totalCents)}</span>
                    </div>

                    <div className={styles.summaryRow}>
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>

                    <div className={styles.totalRow}>
                        <span>Total</span>
                        <span>{formatPrice(cart.totalCents)}</span>
                    </div>

                    <button
                        className={styles.checkoutBtn}
                        onClick={handleCheckout}
                        disabled={checkingOut}
                    >
                        {checkingOut ? 'Processing...' : 'Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
