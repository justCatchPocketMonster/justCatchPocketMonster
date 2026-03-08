import mongoose from "mongoose";
import { newLogger } from "../middlewares/logger";

export default async function connectDatabase() {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not defined");
    await mongoose.connect(process.env.MONGODB_URI, {});

    newLogger("info", "MongoDB connected successfully.");
  } catch (error) {
    newLogger(
      "error",
      error instanceof Error ? error.message : String(error),
      `Error in database connection: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    process.exit(1);
  }
}
