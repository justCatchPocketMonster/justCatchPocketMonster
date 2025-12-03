import { checkTimeForResetEventStat } from "../../../../src/features/event/checkTimeForResetEventStat";
import { Server } from "../../../../src/core/classes/Server";
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
    const originalEventSpawn = server.eventSpawn;

    await checkTimeForResetEventStat(server);

    const updatedServer = await getServerById("test-server");
    expect(updatedServer.eventSpawn).toBe(originalEventSpawn);
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
      {},
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
    );

    await updateServer(server.discordId, server);

    await checkTimeForResetEventStat(server);

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
      {},
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
    );

    await updateServer(server.discordId, server);

    await checkTimeForResetEventStat(server);

    const updatedServer = await getServerById("test-server");
    expect(updatedServer.eventSpawn.whatEvent).not.toBeNull();
    expect(updatedServer.eventSpawn.whatEvent?.id).toBe("test-event");
  });
});
