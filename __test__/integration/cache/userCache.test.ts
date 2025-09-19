import { resetTestEnv } from "../../utils/resetTestEnv";
import { cache as userCache, getUserById } from "../../../src/cache/UserCache";

describe("User cache", () => {
  beforeEach(async () => {
    await resetTestEnv();
  });

  afterAll(async () => {});

  test("Get user", async () => {
    // given

    // when
    const getUser = await getUserById("0123456789");

    // then
    expect(getUser).toBeDefined();
    expect(getUser.discordId).toBe("0123456789");
  });
  test("Get user from cache", async () => {
    // given
    await getUserById("0123456789");
    // when

    const getUser = await getUserById("0123456789");

    // then
    expect(getUser).toBeDefined();
    expect(getUser.discordId).toBe("0123456789");
  });

  test("Get user from mongo", async () => {
    // given
    await getUserById("0123456789");
    userCache.flushAll();

    // when
    const getUser = await getUserById("0123456789");

    // then
    expect(getUser).toBeDefined();
    expect(getUser.discordId).toBe("0123456789");
  });
});
