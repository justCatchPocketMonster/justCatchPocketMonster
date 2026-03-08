import mongoose from "mongoose";
import { cache as serverCache } from "../../src/cache/ServerCache";
import { cache as userCache } from "../../src/cache/UserCache";
import { cache as statCache } from "../../src/cache/StatCache";

export const resetTestEnv = async () => {
  const collections = mongoose.connection.collections;
  for (const name of Object.keys(collections)) {
    await collections[name].deleteMany({});
  }

  serverCache.flushAll();
  userCache.flushAll();
  statCache.flushAll();
};
