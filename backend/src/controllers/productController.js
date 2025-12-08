import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
    try {
        const { q, category, sort = 'createdAt', page = 1, limit = 20 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Build where clause
        const where = {};

        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } }
            ];
        }

        if (category) {
            where.category = {
                slug: category
            };
        }

        // Build orderBy
        const orderBy = {};
        if (sort === 'price_asc') {
            orderBy.priceCents = 'asc';
        } else if (sort === 'price_desc') {
            orderBy.priceCents = 'desc';
        } else if (sort === 'title') {
            orderBy.title = 'asc';
        } else {
            orderBy.createdAt = 'desc';
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    category: true,
                    images: {
                        orderBy: { position: 'asc' }
                    }
                }
            }),
            prisma.product.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: {
                    orderBy: { position: 'asc' }
                }
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { title, slug, description, priceCents, currency, inventoryCount, categoryId, images } = req.body;

        // Validation
        if (!title || !slug || !description || !priceCents || !categoryId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const product = await prisma.product.create({
            data: {
                title,
                slug,
                description,
                priceCents: parseInt(priceCents),
                currency: currency || 'USD',
                inventoryCount: parseInt(inventoryCount) || 0,
                categoryId,
                images: images ? {
                    create: images.map((img, idx) => ({
                        url: img.url,
                        altText: img.altText || title,
                        position: idx
                    }))
                } : undefined
            },
            include: {
                category: true,
                images: true
            }
        });

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, description, priceCents, currency, inventoryCount, categoryId } = req.body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(slug && { slug }),
                ...(description && { description }),
                ...(priceCents && { priceCents: parseInt(priceCents) }),
                ...(currency && { currency }),
                ...(inventoryCount !== undefined && { inventoryCount: parseInt(inventoryCount) }),
                ...(categoryId && { categoryId })
            },
            include: {
                category: true,
                images: true
            }
        });

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: { id }
        });

        res.json({
            success: true,
            data: { message: 'Product deleted successfully' }
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};
