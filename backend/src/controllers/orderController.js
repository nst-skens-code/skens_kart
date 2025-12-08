import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkout = async (req, res) => {
    try {
        // Get user's cart
        const cart = await prisma.cart.findFirst({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Cart is empty'
            });
        }

        // Validate inventory
        for (const item of cart.items) {
            if (item.product.inventoryCount < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: `Insufficient inventory for ${item.product.title}`
                });
            }
        }

        // Calculate total
        const totalCents = cart.items.reduce((sum, item) => sum + (item.unitPriceCents * item.quantity), 0);

        // Create order
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                totalCents,
                status: 'PROCESSING',
                items: {
                    create: cart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPriceCents: item.unitPriceCents
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { take: 1, orderBy: { position: 'asc' } }
                            }
                        }
                    }
                }
            }
        });

        // Update inventory
        for (const item of cart.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    inventoryCount: {
                        decrement: item.quantity
                    }
                }
            });
        }

        // Clear cart
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during checkout'
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };

        const orders = await prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { take: 1, orderBy: { position: 'asc' } }
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const where = { id };
        if (req.user.role !== 'ADMIN') {
            where.userId = req.user.id;
        }

        const order = await prisma.order.findFirst({
            where,
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { take: 1, orderBy: { position: 'asc' } }
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};
