import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function fetchBooksFromAPI() {
    try {
        console.log('📚 Fetching books from Google Books API...');
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject:programming&maxResults=20&langRestrict=en');

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items) {
            console.log('⚠️ No books found from API');
            return [];
        }

        return data.items.map(item => {
            const info = item.volumeInfo;
            // Generate a random price between $15 and $60
            const price = Math.floor(Math.random() * 4500) + 1500;

            // Create a unique slug
            let slug = (info.title || 'book')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            // Append random string to ensure uniqueness
            slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;

            // Get high quality image if available, otherwise thumbnail
            const imageUrl = info.imageLinks?.thumbnail?.replace('http:', 'https:') ||
                'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800';

            return {
                title: info.title || 'Untitled Book',
                slug: slug,
                description: info.description || 'No description available for this book.',
                priceCents: price,
                inventoryCount: Math.floor(Math.random() * 50) + 10,
                categorySlug: 'books',
                images: [
                    { url: imageUrl, altText: info.title || 'Book cover' }
                ]
            };
        });
    } catch (error) {
        console.error('❌ Error fetching books:', error);
        return [];
    }
}

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@skenskart.com' },
        update: {},
        create: {
            email: 'admin@skenskart.com',
            passwordHash: adminPasswordHash,
            name: 'Admin User',
            role: 'ADMIN'
        }
    });
    console.log('✅ Admin user created');

    // Create test user
    const userPasswordHash = await bcrypt.hash('User123!', 12);
    const user = await prisma.user.upsert({
        where: { email: 'user@test.com' },
        update: {},
        create: {
            email: 'user@test.com',
            passwordHash: userPasswordHash,
            name: 'Test User',
            role: 'USER'
        }
    });
    console.log('✅ Test user created');

    // Create cart for test user
    await prisma.cart.upsert({
        where: { id: user.id },
        update: {},
        create: {
            userId: user.id
        }
    });

    // Create categories
    const categories = [
        { name: 'Electronics', slug: 'electronics' },
        { name: 'Clothing', slug: 'clothing' },
        { name: 'Home & Garden', slug: 'home-garden' },
        { name: 'Sports', slug: 'sports' },
        { name: 'Books', slug: 'books' }
    ];

    const createdCategories = {};
    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat
        });
        createdCategories[cat.slug] = category;
    }
    console.log('✅ Categories created');

    // Create hardcoded products
    const hardcodedProducts = [
        {
            title: 'Wireless Bluetooth Headphones',
            slug: 'wireless-bluetooth-headphones',
            description: 'Premium noise-cancelling headphones with 30-hour battery life and superior sound quality.',
            priceCents: 12999,
            inventoryCount: 50,
            categorySlug: 'electronics',
            images: [
                { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', altText: 'Black wireless headphones' }
            ]
        },
        {
            title: 'Smart Watch Pro',
            slug: 'smart-watch-pro',
            description: 'Advanced fitness tracking, heart rate monitoring, and smartphone notifications.',
            priceCents: 29999,
            inventoryCount: 30,
            categorySlug: 'electronics',
            images: [
                { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', altText: 'Smart watch on wrist' }
            ]
        },
        {
            title: 'Premium Cotton T-Shirt',
            slug: 'premium-cotton-tshirt',
            description: 'Soft, breathable 100% organic cotton t-shirt. Available in multiple colors.',
            priceCents: 2499,
            inventoryCount: 100,
            categorySlug: 'clothing',
            images: [
                { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', altText: 'White cotton t-shirt' }
            ]
        },
        {
            title: 'Designer Jeans',
            slug: 'designer-jeans',
            description: 'Classic fit denim jeans with premium stitching and comfortable stretch fabric.',
            priceCents: 7999,
            inventoryCount: 75,
            categorySlug: 'clothing',
            images: [
                { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', altText: 'Blue denim jeans' }
            ]
        },
        {
            title: 'Ergonomic Office Chair',
            slug: 'ergonomic-office-chair',
            description: 'Adjustable lumbar support, breathable mesh back, and premium cushioning.',
            priceCents: 34999,
            inventoryCount: 20,
            categorySlug: 'home-garden',
            images: [
                { url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800', altText: 'Black office chair' }
            ]
        },
        {
            title: 'Ceramic Plant Pot Set',
            slug: 'ceramic-plant-pot-set',
            description: 'Set of 3 handcrafted ceramic pots with drainage holes. Perfect for succulents.',
            priceCents: 3999,
            inventoryCount: 60,
            categorySlug: 'home-garden',
            images: [
                { url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800', altText: 'Ceramic plant pots' }
            ]
        },
        {
            title: 'Yoga Mat Premium',
            slug: 'yoga-mat-premium',
            description: 'Non-slip, eco-friendly yoga mat with extra cushioning and carrying strap.',
            priceCents: 4999,
            inventoryCount: 45,
            categorySlug: 'sports',
            images: [
                { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', altText: 'Purple yoga mat' }
            ]
        },
        {
            title: 'Running Shoes Ultra',
            slug: 'running-shoes-ultra',
            description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.',
            priceCents: 11999,
            inventoryCount: 55,
            categorySlug: 'sports',
            images: [
                { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', altText: 'Red running shoes' }
            ]
        },
        {
            title: '4K Webcam Pro',
            slug: '4k-webcam-pro',
            description: 'Crystal clear 4K video calls with auto-focus and built-in noise-cancelling microphone.',
            priceCents: 8999,
            inventoryCount: 35,
            categorySlug: 'electronics',
            images: [
                { url: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800', altText: 'Black webcam' }
            ]
        },
        {
            title: 'Mechanical Keyboard RGB',
            slug: 'mechanical-keyboard-rgb',
            description: 'Premium mechanical switches with customizable RGB lighting and programmable keys.',
            priceCents: 14999,
            inventoryCount: 40,
            categorySlug: 'electronics',
            images: [
                { url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800', altText: 'RGB mechanical keyboard' }
            ]
        },
        {
            title: 'Leather Jacket Classic',
            slug: 'leather-jacket-classic',
            description: 'Genuine leather jacket with quilted lining and multiple pockets.',
            priceCents: 24999,
            inventoryCount: 25,
            categorySlug: 'clothing',
            images: [
                { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', altText: 'Black leather jacket' }
            ]
        },
        {
            title: 'Sneakers Retro Style',
            slug: 'sneakers-retro-style',
            description: 'Classic retro design with modern comfort technology and durable construction.',
            priceCents: 8999,
            inventoryCount: 65,
            categorySlug: 'clothing',
            images: [
                { url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800', altText: 'White retro sneakers' }
            ]
        },
        {
            title: 'Standing Desk Adjustable',
            slug: 'standing-desk-adjustable',
            description: 'Electric height-adjustable desk with memory presets and cable management.',
            priceCents: 49999,
            inventoryCount: 15,
            categorySlug: 'home-garden',
            images: [
                { url: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800', altText: 'Modern standing desk' }
            ]
        },
        {
            title: 'LED Desk Lamp',
            slug: 'led-desk-lamp',
            description: 'Adjustable brightness and color temperature with USB charging port.',
            priceCents: 5999,
            inventoryCount: 50,
            categorySlug: 'home-garden',
            images: [
                { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', altText: 'Modern desk lamp' }
            ]
        },
        {
            title: 'Resistance Bands Set',
            slug: 'resistance-bands-set',
            description: 'Set of 5 resistance bands with different strength levels and carrying bag.',
            priceCents: 2999,
            inventoryCount: 70,
            categorySlug: 'sports',
            images: [
                { url: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800', altText: 'Colorful resistance bands' }
            ]
        },
        {
            title: 'Water Bottle Insulated',
            slug: 'water-bottle-insulated',
            description: 'Stainless steel vacuum insulated bottle keeps drinks cold for 24 hours.',
            priceCents: 3499,
            inventoryCount: 85,
            categorySlug: 'sports',
            images: [
                { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800', altText: 'Blue water bottle' }
            ]
        }
    ];

    // Fetch books from API
    const apiBooks = await fetchBooksFromAPI();
    console.log(`📚 Fetched ${apiBooks.length} books from API`);

    // Combine products
    const allProducts = [...hardcodedProducts, ...apiBooks];

    for (const product of allProducts) {
        const { categorySlug, images, ...productData } = product;

        // Skip if category doesn't exist (shouldn't happen)
        if (!createdCategories[categorySlug]) {
            console.warn(`⚠️ Category ${categorySlug} not found for product ${product.title}`);
            continue;
        }

        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: {
                ...productData,
                categoryId: createdCategories[categorySlug].id,
                images: {
                    create: images.map((img, idx) => ({
                        ...img,
                        position: idx
                    }))
                }
            }
        });
    }
    console.log('✅ Products created');

    console.log('🎉 Database seed completed successfully!');
    console.log('\n📝 Test credentials:');
    console.log('Admin: admin@skenskart.com / Admin123!');
    console.log('User: user@test.com / User123!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
