import NodeCache from "node-cache";
import { User as UserModel } from "../core/schemas/User";
import { User } from "../core/classes/User";
import { type UserType } from "../core/types/UserType";
import {ttlCache} from "../config/default/misc";

export const cache = new NodeCache({ stdTTL: ttlCache });

export async function getUserById(userId: string): Promise<User> {
  const cached = cache.get<User>(userId);
  if (cached) return cached;

  const data = await UserModel.findOne({ discordId: userId }).lean<UserType>();
  if (!data) {
    const defaultUser = User.createDefault(userId);
    cache.set(userId, defaultUser);
    await updateUser(userId, defaultUser)
    return defaultUser;
  }

  const user = User.fromMongo(data);
  cache.set(userId, user);
  return user;
}

export async function updateUser(
    userId: string,
    update: Partial<UserType>,
): Promise<User> {
  cache.set(userId, update);
  await UserModel.findOneAndUpdate(
      { discordId: userId },
      { $set: { ...update, discordId: userId } },
      { upsert: true, new: true }
  ).lean<UserType>();

  return update as User;
}
