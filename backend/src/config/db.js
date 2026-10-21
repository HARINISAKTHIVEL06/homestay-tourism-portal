const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homestay_portal';
        console.log(`Connecting to MongoDB...`);
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Auto-seed if database is fresh / empty
        await autoSeedIfEmpty();
        return conn;
    } catch (error) {
        console.error(`MongoDB Primary Connection Error: ${error.message}`);
        console.log('Attempting in-memory database fallback...');
        try {
            await mongoose.disconnect().catch(() => {});
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const memoryUri = mongod.getUri();
            const conn = await mongoose.connect(memoryUri);
            console.log(`Fallback In-Memory MongoDB Connected: ${conn.connection.host}`);

            // Auto-seed initial data into in-memory instance
            await autoSeedIfEmpty();
            return conn;
        } catch (fallbackError) {
            console.error(`Fallback DB Error: ${fallbackError.message}`);
        }
    }
};

const autoSeedIfEmpty = async () => {
    try {
        const Homestay = require('../models/Homestay');
        const count = await Homestay.countDocuments();
        if (count === 0) {
            console.log('Database is empty. Triggering automated seeding of sample homestays and accounts...');
            const seedData = require('../seed');
            await seedData(true); // pass true to skip re-connecting to DB
            console.log('Automated database seeding complete!');
        }
    } catch (err) {
        console.error('Auto-seed check error:', err.message);
    }
};

module.exports = connectDB;
