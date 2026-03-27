import mongoose from "mongoose";
import { cache as serverCache } from "../../src/cache/ServerCache";
import { cache as userCache } from "../../src/cache/UserCache";
import { cache as statCache } from "../../src/cache/StatCache";

export const resetTestEnv = async () => {
  const rawReadyState = (mongoose.connection as unknown as { readyState?: unknown })
    .readyState;
  if (typeof rawReadyState !== "number") {
    const collections = mongoose.connection.collections;
    for (const name of Object.keys(collections)) {
      await collections[name].deleteMany({});
    }

    serverCache.flushAll();
    userCache.flushAll();
    statCache.flushAll();
    return;
  }

  const isConnected = () => Number(mongoose.connection.readyState) === 1;

  if (!isConnected()) {
    const deadline = Date.now() + 30_000;
    while (!isConnected() && Date.now() < deadline) {
      const uri = process.env.MONGODB_URI;
      if (uri) {
        await mongoose.connect(uri, { dbName: "test" });
        break;
      }
      await new Promise((r) => setTimeout(r, 50));
    }

    if (!isConnected()) {
      throw new Error(
        "MongoDB is not ready for tests (MONGODB_URI missing or connection not established).",
      );
    }
  }

  const collections = mongoose.connection.collections;
  for (const name of Object.keys(collections)) {
    await collections[name].deleteMany({});
  }

  serverCache.flushAll();
  userCache.flushAll();
  statCache.flushAll();
};
