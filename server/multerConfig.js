import multer from 'multer';
import { storage } from './config/cloudinary.js'; // Import from your new config

const upload = multer({ storage });

export { upload };