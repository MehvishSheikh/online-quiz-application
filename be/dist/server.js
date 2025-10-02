"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quizrouter_1 = __importDefault(require("./routes/quizrouter"));
const db_1 = require("./config/db");
const cors = require('cors');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('🚀 Starting server...');
console.log('📁 Environment variables loaded');
// Spin up the Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
console.log(`🌐 Server will run on port: ${PORT}`);
// Middleware with logging
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express_1.default.json());
console.log('✅ Middleware configured');
// Routes
app.use('/api', quizrouter_1.default);
console.log('✅ Routes configured');
// Simple health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Quiz API is running' });
});
// Last-chance error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
const server = app.listen(PORT, () => {
    console.log(`🎉 Server is running successfully on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🤖 AI Assessment endpoint: http://localhost:${PORT}/api/ai-assessment/generate`);
    console.log(`✅ Backend ready to receive requests!`);
});
// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        (0, db_1.closeDatabase)();
        process.exit(0);
    });
});
exports.default = app;
