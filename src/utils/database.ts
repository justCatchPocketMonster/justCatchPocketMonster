import mongoose from "mongoose";
import { newLogger } from "../middlewares/logger";

export default async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not defined");
    await mongoose.connect(process.env.MONGODB_URI, {});

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    newLogger(
      "error",
      error as string,
      `Error in database connection: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    process.exit(1);
  }
};
