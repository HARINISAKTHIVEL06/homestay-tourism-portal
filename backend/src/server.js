const dotenv = require('dotenv');
const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.JEST_WORKER_ID);
dotenv.config();
if (isTestEnv) {
    process.env.NODE_ENV = 'test';
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandlerMiddleware');

const dbPromise = connectDB();

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Register API Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/homestays', require('./routes/homestayRoutes'));
app.use('/api/v1/inspections', require('./routes/inspectionRoutes'));
app.use('/api/v1/rating-criteria', require('./routes/criteriaRoutes'));
app.use('/api/v1/grievances', require('./routes/grievanceRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        service: 'State Tourism Department Homestay Registration & Quality Rating Management Portal API',
        status: 'Online',
        version: '1.0.0',
        documentation: {
            health: '/api/v1/health',
            publicDirectory: '/api/v1/homestays/public',
            auth: '/api/v1/auth',
        },
    });
});

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Homestay Quality Rating API is running smoothly',
        timestamp: new Date(),
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

module.exports = app;
module.exports.dbPromise = dbPromise;
