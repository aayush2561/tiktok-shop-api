import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary.js';
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_photos',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});


const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'short_videos', 
    allowedFormats: ['mp4', 'mov', 'avi', 'mkv'], 
    resource_type: 'video', 
  },
});

export const upload = multer({ storage: storage });
export const uploadVideo = multer({storage: videoStorage, limits: { fileSize: 5 * 1024 * 1024 },});



