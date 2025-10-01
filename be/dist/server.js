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
// Spin up the Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express_1.default.json());
// Routes
app.use('/api', quizrouter_1.default);
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
    console.log(`Server is running on port ${PORT}`);
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
