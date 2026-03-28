import { config } from "dotenv";
import mongoose from "mongoose";
import { giveRandomPokemonToAllUsers } from "../src/features/dev/giveRandomPokemonToAllUsers";

config();

async function main() {
  if (process.env.ENVIRONMENT !== "dev") {
    console.error(
      "This script can only run in dev environment. Set ENVIRONMENT=dev in .env",
    );
    process.exit(1);
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("Connected to MongoDB");

    await giveRandomPokemonToAllUsers();

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
