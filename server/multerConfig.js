import multer from 'multer';
import { storage as cloudinaryStorage } from './config/cloudinary.js';
import path from 'path';
import fs from 'fs'; // Import fs to check directories

// 1. Cloudinary Upload (For Profile/Evidence Images)
const upload = multer({ storage: cloudinaryStorage });

// 2. Local Upload (For CSV/Temp Files)
// Ensure 'uploads' directory exists, similar to your server.js check
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to local 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const localUpload = multer({ 
  storage: localStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  }
});

export { upload, localUpload };