import express from 'express';
import {
  signup,
  login,
  sendOtp,
  verifyOtp,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
} from '../controllers/AuthController.js';
import upload from '../middleware/MulterUpload.js';
const router = express.Router();

router.post('/signup', upload.single('photo'), signup);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/send-otp', sendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/check-auth', checkAuth);
router.get('/logout', logout);

export default router;
