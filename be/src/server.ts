import express from 'express';
import quizRoutes from './routes/quizrouter';
import { closeDatabase } from './config/db';
const cors = require('cors');
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', quizRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Quiz API is running' });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
});

export default app;