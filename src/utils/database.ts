import mongoose from "mongoose";
import logger from "../middlewares/error";

export default async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not defined");
    await mongoose.connect(process.env.MONGODB_URI, {});

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    logger.error(error);
    process.exit(1);
  }
};
