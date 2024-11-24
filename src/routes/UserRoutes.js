import express from 'express';
import {
  updateUserProfile,
  deleteUser,
  getUserProfile,
  updateUserRole,
} from '../controllers/UserController.js';
import { protectedRoute } from '../middleware/ProtectedRoute.js';
import {upload} from '../middleware/MulterUpload.js';

const router = express.Router();

router.patch(
  '/profile',
  protectedRoute(['admin', 'seller', 'user']),
  upload.single('photo'),
  updateUserProfile
);

router.delete(
  '/profile',
  protectedRoute(['admin', 'seller', 'user']),
  deleteUser
);

router.get(
  '/profile/:id?',
  protectedRoute(['admin', 'seller', 'user']),
  getUserProfile
);

router.patch('/profile/role', protectedRoute(['admin']), updateUserRole);
export default router;
