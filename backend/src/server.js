const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandlerMiddleware');

dotenv.config();

connectDB();

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

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Homestay Quality Rating API is running smoothly',
        timestamp: new Date(),
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

module.exports = app;
