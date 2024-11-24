import express from 'express';
import { 
  createVideoController, 
  getVideoByIdController, 
  deleteVideoByIdController,
  interactWithVideoController
} from '../controllers/VideoController.js'; 
import { protectedRoute } from '../middleware/ProtectedRoute.js'; 
import { uploadVideo } from '../middleware/MulterUpload.js'; 

const router = express.Router();

router.post(
  '/create',
  protectedRoute(['user', 'admin', 'seller']), 
  uploadVideo.single('video'), 
  createVideoController 
);

router.get(
  '/:id',
  protectedRoute(['user', 'admin', 'seller']), 
  getVideoByIdController 
);

router.delete(
  '/delete/:id',
  protectedRoute(['admin', 'seller','user']), 
  deleteVideoByIdController 
);

router.post(
  '/interaction/:id',
  protectedRoute(['user', 'admin', 'seller']),
  interactWithVideoController 
);

export default router;
