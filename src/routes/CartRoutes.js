import express from 'express';
import {
  addCart,
  getByUserId,
  updateById,
  deleteById,
} from '../controllers/CartController.js';
import { protectedRoute } from '../middleware/ProtectedRoute.js';
const router = express.Router();

router.post('/', protectedRoute(['user', 'seller', 'admin']), addCart);
router.get(
  '/user/:id',
  protectedRoute(['user', 'seller', 'admin']),
  getByUserId
);
router.patch('/:id', protectedRoute(['user', 'seller', 'admin']), updateById);
router.delete('/:id', protectedRoute(['user', 'seller', 'admin']), deleteById);

export default router;
