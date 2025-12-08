import express from 'express';
import { checkout, getOrders, getOrder } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/checkout', authMiddleware, checkout);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrder);

export default router;
