const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agroshop';

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB || 'agroshop'
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectDB;

