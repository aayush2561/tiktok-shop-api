import express from 'express';
import {
  createOrder,
  getAllOrder,
  getByUserId,
  updateById,
  deleteById,
  updateStatus
} from '../controllers/OrderController.js';
import { protectedRoute } from '../middleware/ProtectedRoute.js';
const router = express.Router();

router.post(
  '/create',
  protectedRoute(['user', 'seller', 'admin']),
  createOrder
);
router.get('/', protectedRoute(['admin']), getAllOrder);
router.get('/user/', protectedRoute(['user', 'seller', 'admin']), getByUserId);
router.patch('/:id', protectedRoute(['user', 'seller', 'admin']), updateById);
router.delete('/:id',protectedRoute(['user', 'seller', 'admin']), deleteById);
router.patch('/:id/status',protectedRoute([ 'admin']),updateStatus);
export default router;
