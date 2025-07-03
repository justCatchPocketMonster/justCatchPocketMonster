import NodeCache from 'node-cache';
import { User as UserModel } from '../core/schemas/User';
import { User } from '../core/classes/User';
import { type UserType } from '../core/types/UserType';

const cache = new NodeCache({ stdTTL: 600 });


export async function getUserById(userId: string): Promise<User | null> {
    const cached = cache.get<User>(userId);
    if (cached) return cached;

    const data = await UserModel.findOne({ userId }).lean<UserType>();
    if (!data) return null;

    const user = User.fromMongo(data);
    cache.set(userId, user);
    return user;
}

export async function updateUser(userId: string, update: Partial<UserType>): Promise<User | null> {
    const updated = await UserModel.findOneAndUpdate({ userId }, update, { new: true }).lean<UserType>();
    if (!updated) return null;

    const user = User.fromMongo(updated);
    cache.set(userId, user);
    return user;
}
