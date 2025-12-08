# SkensKart Backend

Node.js + Express + Prisma backend API for SkensKart e-commerce platform.

## Features

- RESTful API with Express
- PostgreSQL database with Prisma ORM
- JWT authentication
- Bcrypt password hashing
- Rate limiting and security middleware
- Comprehensive error handling
- Database migrations and seeding

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Seed the database:
```bash
npm run seed
```

7. Start the development server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run migrate:dev` - Run migrations in development
- `npm run seed` - Seed the database
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Open Prisma Studio

## API Endpoints

See root README.md for complete API documentation.

## Database Schema

The database includes the following tables:
- users
- categories
- products
- product_images
- carts
- cart_items
- orders
- order_items
- addresses

## Testing

Run tests with:
```bash
npm test
```

## Docker

Build and run with Docker:
```bash
docker build -t skenskart-backend .
docker run -p 5000:5000 skenskart-backend
```

Or use docker-compose:
```bash
docker-compose up
```
