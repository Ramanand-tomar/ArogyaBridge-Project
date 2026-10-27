import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Router from './routers/Routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.mongoURI || 'mongodb://localhost:27017/healthcare';

// Security Headers (configured to allow external resource embed if needed)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Avoid blocking Vite or IPFS assets during local development
  })
);

// Rate Limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api/', limiter);

// CORS configuration
app.use(
  cors({
    origin: '*', // In production, specify exact domain: e.g. ['http://localhost:5173']
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ArogyaBridge Backend',
  });
});

// Primary API Router
app.use(Router);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected internal server error occurred',
  });
});

// Database Connection
mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start Server
app.listen(port, () => {
  console.log(`🚀 ArogyaBridge Server is running on port: ${port}`);
});

export default app;