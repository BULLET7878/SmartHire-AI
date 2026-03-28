const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log('MongoDB is already connected.');
            return;
        }
        if (!process.env.MONGO_URI) {
            console.error('Missing MONGO_URI string');
            return;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

module.exports = connectDB;
