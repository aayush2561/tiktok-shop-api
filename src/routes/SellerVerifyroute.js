import express from 'express';
import {
  requestSeller,
  getSellerRequestbyId,
  getAllSellerRequests,
} from '../controllers/SellerVerifyController.js';
import {upload} from '../middleware/MulterUpload.js';
import { protectedRoute } from '../middleware/ProtectedRoute.js';

const router = express.Router();

router.post(
  '/',
  protectedRoute(['user']),
  upload.fields([{ name: 'front' }, { name: 'back' }]),
  requestSeller
);
router.get('/', protectedRoute(['admin']), getAllSellerRequests);
router.get('/:id', protectedRoute(['admin']), getSellerRequestbyId);

export default router;
