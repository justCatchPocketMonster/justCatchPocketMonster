import { checkTimeForResetEventStat } from "../../../../src/features/event/checkTimeForResetEventStat";
import { EventSpawn } from "../../../../src/core/classes/EventSpawn";
import { Event } from "../../../../src/core/classes/Event";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById, updateServer } from "../../../../src/cache/ServerCache";

jest.mock("../../../../src/middlewares/logger", () => ({
  newLogger: jest.fn(),
}));

describe("checkTimeForResetEventStat", () => {
  beforeEach(async () => {
    await resetTestEnv();
  });

  test("should not reset when event has no endTime", async () => {
    const server = await getServerById("test-server");
    const originalWhatEvent = server.eventSpawn.whatEvent;

    await checkTimeForResetEventStat(server);

    const updatedServer = await getServerById("test-server");
    expect(updatedServer.eventSpawn.whatEvent).toBe(originalWhatEvent);
  });

  test("should reset event when endTime has passed", async () => {
    const server = await getServerById("test-server");
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const event = new Event(
      "test-event",
      "testEventName" as any,
      "testEventDescription" as any,
      "standard" as any,
      "#FF0000",
      "test-image.png",
      "testEffectDescription" as any,
      pastDate,
      {
        level1: {},
        level2: {},
        level3: {},
      },
    );

    server.eventSpawn = new EventSpawn(
      server.eventSpawn.gen,
      server.eventSpawn.type,
      server.eventSpawn.rarity,
      server.eventSpawn.shiny,
      event,
      server.eventSpawn.allowedForm,
      server.eventSpawn.messageSpawn,
      server.eventSpawn.nightMode,
      server.eventSpawn.valueMaxChoiceEgg,
      server.eventSpawn.valueMaxChoiceRaid,
    );

    await updateServer(server.discordId, server);
    const serverWithEvent = await getServerById("test-server");

    await checkTimeForResetEventStat(serverWithEvent);

    const updatedServer = await getServerById("test-server");
    expect(updatedServer.eventSpawn.whatEvent).toBeNull();
  });

  test("should not reset event when endTime has not passed", async () => {
    const server = await getServerById("test-server");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const event = new Event(
      "test-event",
      "testEventName" as any,
      "testEventDescription" as any,
      "standard" as any,
      "#FF0000",
      "test-image.png",
      "testEffectDescription" as any,
      futureDate,
      {
        level1: {},
        level2: {},
        level3: {},
      },
    );

    server.eventSpawn = new EventSpawn(
      server.eventSpawn.gen,
      server.eventSpawn.type,
      server.eventSpawn.rarity,
      server.eventSpawn.shiny,
      event,
      server.eventSpawn.allowedForm,
      server.eventSpawn.messageSpawn,
      server.eventSpawn.nightMode,
      server.eventSpawn.valueMaxChoiceEgg,
      server.eventSpawn.valueMaxChoiceRaid,
    );

    await updateServer(server.discordId, server);
    const serverWithEvent = await getServerById("test-server");

    await checkTimeForResetEventStat(serverWithEvent);

    const updatedServer = await getServerById("test-server");
    expect(updatedServer.eventSpawn.whatEvent).not.toBeNull();
    expect(updatedServer.eventSpawn.whatEvent?.id).toBe("test-event");
  });
});
