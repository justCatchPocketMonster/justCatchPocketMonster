import { selectEventStandard } from "../../../../src/features/event/selectEventStandard";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById } from "../../../../src/cache/ServerCache";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import * as helperFunction from "../../../../src/utils/helperFunction";

jest.mock("../../../../src/middlewares/logger", () => ({
  newLogger: jest.fn(),
}));

describe("selectEventStandard", () => {
  let server: any;

  beforeEach(async () => {
    await resetTestEnv();
    const interaction = createMockInteraction();
    server = await getServerById(interaction.guildId!);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should select event and apply modifiers", async () => {
    jest.spyOn(helperFunction, "random").mockReturnValue(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent).not.toBeNull();
    expect(server.eventSpawn.whatEvent?.id).toBeDefined();
  });

  test("should handle event with generationRandom", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent).not.toBeNull();
  });

  test("should handle event with typeRandom", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent).not.toBeNull();
  });

  test("should handle event with level 3", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(99)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent).not.toBeNull();
  });

  test("should handle event with level 2", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(70)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent).not.toBeNull();
  });

  test("should handle event with level 1", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent).not.toBeNull();
  });

  test("should handle event id 9 with image change", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(8)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("9");
  });

  test("should handle event id 10 with duration", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(9)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("10");
    expect(server.eventSpawn.whatEvent?.endTime).toBeDefined();
  });

  test("should handle event id 7 with duration", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("7");
    expect(server.eventSpawn.whatEvent?.endTime).toBeDefined();
  });

  test("should handle event id 1", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("1");
  });

  test("should handle event id 2", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("2");
  });

  test("should handle event id 3", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("3");
  });

  test("should handle event id 4", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("4");
  });

  test("should handle event id 5", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("5");
  });

  test("should handle event id 6", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("6");
  });

  test("should handle event id 8", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(7)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("8");
  });

  test("should handle event id 11", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("11");
  });

  test("should handle event id 12", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(11)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.id).toBe("12");
  });

  test("should handle getDurationText with level 3", async () => {
    server.settings.language = "fr";
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(99)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.effectDescription).toContain("heure");
  });

  test("should handle getDurationText with level 2", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(70)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.effectDescription).toBeDefined();
  });

  test("should handle getDurationText with level 1", async () => {
    server.settings.language = "fr";
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0);

    await selectEventStandard(server);

    expect(server.eventSpawn.whatEvent?.effectDescription).toContain("15 minutes");
  });
});
