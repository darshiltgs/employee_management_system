import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { MongoClient } from "mongodb";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected successfully at ${connection.connection.host}`
    );
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export const connectMongoDB = async () => {
  const client = new MongoClient(`${process.env.MONGODB_URL}`);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    console.log(`MongoDB connected successfully.`);
    return db;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
