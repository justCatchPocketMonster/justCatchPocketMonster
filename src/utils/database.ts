import mongoose from "mongoose";
import logger, {newLogger} from "../middlewares/logger";
import language from "../lang/language";

export default async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not defined");
    await mongoose.connect(process.env.MONGODB_URI, {});

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    newLogger(
        'error',
        error as string,
        `Error in database connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    process.exit(1);
  }
};
