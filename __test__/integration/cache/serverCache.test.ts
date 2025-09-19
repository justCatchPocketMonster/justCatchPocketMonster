import { resetTestEnv } from "../../utils/resetTestEnv";
import {
  cache as serverCache,
  getServerById,
} from "../../../src/cache/ServerCache";

describe("Server cache", () => {
  beforeEach(async () => {
    await resetTestEnv();
  });

  afterAll(async () => {});

  test("Get server", async () => {
    // given

    // when
    const getServer = await getServerById("0123456789");

    // then
    expect(getServer).toBeDefined();
    expect(getServer.discordId).toBe("0123456789");
  });
  test("Get server from cache", async () => {
    // given
    await getServerById("0123456789");
    // when

    const getServer = await getServerById("0123456789");

    // then
    expect(getServer).toBeDefined();
    expect(getServer.discordId).toBe("0123456789");
  });

  test("Get server from mongo", async () => {
    // given
    await getServerById("0123456789");
    serverCache.flushAll();

    // when
    const getServer = await getServerById("0123456789");

    // then
    expect(getServer).toBeDefined();
    expect(getServer.discordId).toBe("0123456789");
  });
});
