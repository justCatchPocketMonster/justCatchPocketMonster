import mongoose from "mongoose";

// Mock caches used by resetTestEnv
jest.mock("../../../src/cache/ServerCache", () => ({
  cache: { flushAll: jest.fn() },
}));
jest.mock("../../../src/cache/UserCache", () => ({
  cache: { flushAll: jest.fn() },
}));
jest.mock("../../../src/cache/StatCache", () => ({
  cache: { flushAll: jest.fn() },
}));

// Import after mocks so the module uses mocked caches
import { resetTestEnv } from "../../../__test__/utils/resetTestEnv";

describe("resetTestEnv", () => {
  it("deletes all collections and flushes caches", async () => {
    const deleteManyA = jest.fn().mockResolvedValue({});
    const deleteManyB = jest.fn().mockResolvedValue({});

    // Spy on mongoose.connection getter to provide fake collections
    const connectionGetSpy = jest
      .spyOn(mongoose, "connection", "get")
      .mockReturnValue({
        collections: {
          colA: { deleteMany: deleteManyA },
          colB: { deleteMany: deleteManyB },
        },
      } as unknown as typeof mongoose.connection);

    // Pull mocked caches to assert flushAll calls
    const { cache: serverCache } = await import(
      "../../../src/cache/ServerCache"
    );
    const { cache: userCache } = await import(
      "../../../src/cache/UserCache"
    );
    const { cache: statCache } = await import(
      "../../../src/cache/StatCache"
    );

    await resetTestEnv();

    expect(deleteManyA).toHaveBeenCalledWith({});
    expect(deleteManyB).toHaveBeenCalledWith({});

    expect((serverCache.flushAll as jest.Mock)).toHaveBeenCalledTimes(1);
    expect((userCache.flushAll as jest.Mock)).toHaveBeenCalledTimes(1);
    expect((statCache.flushAll as jest.Mock)).toHaveBeenCalledTimes(1);

    connectionGetSpy.mockRestore();
  });
});

