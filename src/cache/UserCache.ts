import NodeCache from "node-cache";
import { User as UserModel } from "../core/schemas/User";
import { User } from "../core/classes/User";
import { type UserType } from "../core/types/UserType";

const cache = new NodeCache({ stdTTL: 600 });

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
  const updated = await UserModel.findOneAndUpdate(
      { discordId: userId },
      { $set: { ...update, discordId: userId } },
      { upsert: true, new: true }
  ).lean<UserType>();

  const user = User.fromMongo(updated);
  cache.set(userId, user);
  return user;
}
