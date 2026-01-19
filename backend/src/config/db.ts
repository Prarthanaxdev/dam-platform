import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error connecting to MongoDB: ${errorMessage}`);
    // Don't exit process in serverless - just log the error
    if (process.env.VERCEL) {
      console.error('MongoDB connection failed in serverless environment');
    } else {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;
