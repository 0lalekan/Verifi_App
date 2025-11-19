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

// 1. CRITICAL: Ensure Uploads Directory Exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Load environment variables
dotenv.config();

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
  process.exit(1);
});

// Initialize Express app
const app = express();

// Middleware
app.use(cors());

// --- FIX: Configure Helmet to allow images to be loaded from other origins ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/reports', reportRoutes);


// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

// Make io accessible to our routers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

function startServer() {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}

if (!MONGO_URI || MONGO_URI.includes('<')) {
  console.warn('MONGO_URI not provided or contains placeholder; skipping MongoDB connection.');
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
  res.status(200).send('Server is up and running');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({ message: err.message || 'Internal Server Error' });
});

export default app;