import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes    from './routes/auth.js';
import videoRoutes   from './routes/videos.js';
import channelRoutes from './routes/channels.js';
import commentRoutes from './routes/comments.js';
import errorHandler  from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// Allow the frontend dev URL(s). Use CLIENT_URL env (comma-separated) or default localhost dev ports.
const CLIENT_URLS = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:5174')
	.split(',')
	.map((s) => s.trim());

app.use(
	cors({
		origin: (origin, callback) => {
			// Allow non-browser requests (e.g., Postman) with no origin
			if (!origin) return callback(null, true);
			if (CLIENT_URLS.includes(origin)) return callback(null, true);
			return callback(new Error('Not allowed by CORS'));
		},
		credentials: true,
	})
);
app.use(express.json());

// API Routes
app.use('/api/auth',     authRoutes);
app.use('/api/videos',   videoRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/comments', commentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Server is running' }));

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
