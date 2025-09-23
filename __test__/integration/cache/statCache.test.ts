import { resetTestEnv } from "../../utils/resetTestEnv";
import { cache as statCache, getStatById } from "../../../src/cache/StatCache";

describe("Stat cache", () => {
  beforeEach(async () => {
    await resetTestEnv();
  });

  afterAll(async () => {});

  test("Get stat", async () => {
    // given

    // when
    const getStat = await getStatById("1.0.0");

    // then
    expect(getStat).toBeDefined();
    expect(getStat.version).toBe("1.0.0");
  });
  test("Get stat from cache", async () => {
    // given
    await getStatById("1.0.0");
    // when

    const getStat = await getStatById("1.0.0");

    // then
    expect(getStat).toBeDefined();
    expect(getStat.version).toBe("1.0.0");
  });

  test("Get stat from mongo", async () => {
    // given
    await getStatById("1.0.0");
    statCache.flushAll();

    // when
    const getStat = await getStatById("1.0.0");

    // then
    expect(getStat).toBeDefined();
    expect(getStat.version).toBe("1.0.0");
  });
});
