import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: {
                                    orderBy: { position: 'asc' },
                                    take: 1
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        // Calculate total
        const total = cart.items.reduce((sum, item) => sum + (item.unitPriceCents * item.quantity), 0);

        res.json({
            success: true,
            data: {
                ...cart,
                totalCents: total
            }
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }

        // Get product
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        if (product.inventoryCount < quantity) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient inventory'
            });
        }

        // Get or create cart
        let cart = await prisma.cart.findFirst({
            where: { userId: req.user.id }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.user.id }
            });
        }

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });

        let cartItem;
        if (existingItem) {
            cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + parseInt(quantity)
                },
                include: {
                    product: {
                        include: {
                            images: { take: 1, orderBy: { position: 'asc' } }
                        }
                    }
                }
            });
        } else {
            cartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity: parseInt(quantity),
                    unitPriceCents: product.priceCents
                },
                include: {
                    product: {
                        include: {
                            images: { take: 1, orderBy: { position: 'asc' } }
                        }
                    }
                }
            });
        }

        res.status(201).json({
            success: true,
            data: cartItem
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                error: 'Valid quantity is required'
            });
        }

        const cartItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: parseInt(quantity) },
            include: {
                product: {
                    include: {
                        images: { take: 1, orderBy: { position: 'asc' } }
                    }
                }
            }
        });

        res.json({
            success: true,
            data: cartItem
        });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        await prisma.cartItem.delete({
            where: { id: itemId }
        });

        res.json({
            success: true,
            data: { message: 'Item removed from cart' }
        });
    } catch (error) {
        console.error('Remove cart item error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};
