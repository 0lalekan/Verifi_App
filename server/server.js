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
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js';
import teleDiagCaseRoutes from './routes/teleDiagCaseRoutes.js';
import logRoutes from './routes/logRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

// Global error handlers to surface issues that would otherwise crash silently
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
  // optional: exit after logging
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
  // optional: exit after logging
  process.exit(1);
});

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cases', teleDiagCaseRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/reports', reportRoutes);


// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Adjust for your client's origin
    methods: ['GET', 'POST'],
  },
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Start server helper
function startServer() {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}

// If MONGO_URI is not provided or looks like a placeholder, skip DB connect and start server
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

// Basic root route for health checks
app.get('/', (req, res) => {
  res.status(200).send('Server is up and running');
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Example: Listen for a custom event from the client
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  // If a route/middleware already set a statusCode (e.g. 401), preserve it.
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({ message: err.message || 'Internal Server Error' });
});

export default app;
