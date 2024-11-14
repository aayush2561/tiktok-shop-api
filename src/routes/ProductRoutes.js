import express from 'express';
import {createProduct,deleteById } from '../controllers/ProductController.js'; 
import { protectedRoute } from '../middleware/ProtectedRoute.js';
import upload from '../middleware/MulterUpload.js';
const router = express.Router();

router.post("/create",protectedRoute(['admin', 'seller']),upload.fields([{name:"thumbnail"},{name:"images",maxCount:3}]),createProduct);

router.delete("/delete/:id",protectedRoute(['admin', 'seller']), deleteById);

export default router;
