import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

export default connectDB;
