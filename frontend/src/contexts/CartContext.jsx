import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchCart = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const response = await api.get('/cart');
            setCart(response.data.data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [isAuthenticated]);

    const addToCart = async (productId, quantity = 1) => {
        try {
            await api.post('/cart', { productId, quantity });
            await fetchCart();
        } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        try {
            await api.put(`/cart/${itemId}`, { quantity });
            await fetchCart();
        } catch (error) {
            console.error('Failed to update cart item:', error);
            throw error;
        }
    };

    const removeCartItem = async (itemId) => {
        try {
            await api.delete(`/cart/${itemId}`);
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove cart item:', error);
            throw error;
        }
    };

    const cartItemCount = cart?.items?.length || 0;
    const cartTotal = cart?.totalCents || 0;

    const value = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeCartItem,
        refreshCart: fetchCart,
        cartItemCount,
        cartTotal
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
