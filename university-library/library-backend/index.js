import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import './config/redis.js'; // Just importing it will trigger the connection
import db from './config/db.js';
import authRoutes from './routes/authroutes.js';
import { errorMiddleware } from './middleware/errorMiddlewares.js';

const app = express();

// Middleware configuration
app.use(cors({
    origin: ['http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Use Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT "Database connection is alive!" AS message');
        res.json({ server: "Running", db_message: rows[0].message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;