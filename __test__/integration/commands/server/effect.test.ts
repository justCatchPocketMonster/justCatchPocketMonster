import mongoose from "mongoose";
import effect from "../../../../src/commands/server/effect";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { Event } from "../../../../src/core/classes/Event";
import { getServerById, updateServer } from "../../../../src/cache/ServerCache";
import language from "../../../../src/lang/language";
import { resetTestEnv } from "../../../utils/resetTestEnv";

describe("effect command", () => {
  let interaction: any;
  beforeEach(async () => {
    await resetTestEnv();

    interaction = createMockInteraction();
    (interaction.options.getSubcommand as jest.Mock).mockReturnValue(
      "language",
    );
  });

  afterAll(async () => {});

  test("Reply event", async () => {
    // given
    const serverGiven = await getServerById(interaction.guildId);
    serverGiven.eventSpawn.whatEvent = defaultEvent();
    await updateServer(serverGiven.discordId, serverGiven);

    // when
    await effect.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
  });

  test("No event error", async () => {
    // given

    // when
    await effect.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock.mock.calls[0][0]).toEqual({
      content: language("noEvent", "eng"),
    });
  });
});

function defaultEvent(): Event {
  return new Event(
    "1",
    "Test Event",
    "This is a test event",
    "test",
    "#FF0000",
    "https://example.com/image.png",
    "This is an effect description for the test event.",
    new Date(Date.now() + 3600000),
  );
}
