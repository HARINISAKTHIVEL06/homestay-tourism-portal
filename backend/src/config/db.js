const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homestay_portal';
        console.log(`Connecting to MongoDB...`);
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // 5s timeout instead of hanging
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Primary Connection Error: ${error.message}`);
        console.log('Attempting in-memory database fallback...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const memoryUri = mongod.getUri();
            const conn = await mongoose.connect(memoryUri);
            console.log(`Fallback In-Memory MongoDB Connected: ${conn.connection.host}`);

            // Auto-seed initial data into in-memory instance
            const seedFn = require('../seed');
        } catch (fallbackError) {
            console.error(`Fallback DB Error: ${fallbackError.message}`);
        }
    }
};

module.exports = connectDB;
