import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import userRoutes from './routes/userRoutes';
import counsellorRoutes from './routes/counsellorRoutes';
import adminRoutes from './routes/adminRoutes';
import sessionRoutes from './routes/sessionRoutes';
import topicRoutes from './routes/topicRoutes';
import locationRoutes from './routes/locationRoutes';

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/counsellors', counsellorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/locations', locationRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Hire a Counsellor API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
