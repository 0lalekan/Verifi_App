import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js';
import logRoutes from './routes/logRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure Uploads Directory Exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

dotenv.config();

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

const app = express();

// --- SECURITY CONFIGURATION ---
// 1. CORS: Allow your frontend to talk to this backend
app.use(cors({
  // In production, you should change '*' to your actual Vercel URL array
  // e.g., origin: ["https://verifi-app.vercel.app", "http://localhost:5173"]
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true // Allow cookies (JWT)
}));

// 2. Helmet: Allow images to be loaded cross-origin
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/reports', reportRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ['GET', 'POST'],
    credentials: true
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

function startServer() {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}

if (!MONGO_URI) {
  console.warn('MONGO_URI not provided; skipping DB connection.');
  startServer();
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB connected successfully');
      startServer();
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message);
      process.exit(1);
    });
}

app.get('/', (req, res) => {
  res.status(200).send('Verifi API is running');
});

io.on('connection', (socket) => {
  // console.log('A user connected:', socket.id);
});

export default app;