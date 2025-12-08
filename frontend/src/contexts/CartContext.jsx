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

    const fetchCart = async (silent = false) => {
        if (!isAuthenticated) return;

        try {
            if (!silent) setLoading(true);
            const response = await api.get('/cart');
            setCart(response.data.data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            if (!silent) setLoading(false);
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
            await fetchCart(true); // Silent refresh
        } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        // Optimistic update
        const previousCart = { ...cart };

        setCart(prev => {
            if (!prev) return prev;
            const updatedItems = prev.items.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            );

            // Recalculate total (approximate)
            const newTotal = updatedItems.reduce((sum, item) => sum + (item.unitPriceCents * item.quantity), 0);

            return {
                ...prev,
                items: updatedItems,
                totalCents: newTotal
            };
        });

        try {
            await api.put(`/cart/${itemId}`, { quantity });
            // We can do a silent refresh to ensure server sync, but the UI is already updated
            await fetchCart(true);
        } catch (error) {
            console.error('Failed to update cart item:', error);
            setCart(previousCart); // Revert on error
            throw error;
        }
    };

    const removeCartItem = async (itemId) => {
        // Optimistic update
        const previousCart = { ...cart };

        setCart(prev => {
            if (!prev) return prev;
            const updatedItems = prev.items.filter(item => item.id !== itemId);

            // Recalculate total
            const newTotal = updatedItems.reduce((sum, item) => sum + (item.unitPriceCents * item.quantity), 0);

            return {
                ...prev,
                items: updatedItems,
                totalCents: newTotal
            };
        });

        try {
            await api.delete(`/cart/${itemId}`);
            await fetchCart(true);
        } catch (error) {
            console.error('Failed to remove cart item:', error);
            setCart(previousCart);
            throw error;
        }
    };

    const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const cartTotal = cart?.totalCents || 0;

    const value = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeCartItem,
        refreshCart: () => fetchCart(false),
        cartItemCount,
        cartTotal
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
