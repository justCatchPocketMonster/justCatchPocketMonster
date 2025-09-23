import effect from "../../../../src/commands/server/effect";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { Event } from "../../../../src/core/classes/Event";
import { getServerById, updateServer } from "../../../../src/cache/ServerCache";
import { resetTestEnv } from "../../../utils/resetTestEnv";

describe("effect command", () => {
  let interaction: any;
  const fixedDate = new Date("2025-12-14T00:00:00Z");
  const realNow = Date.now;

  beforeEach(async () => {
    await resetTestEnv();
    Date.now = () => fixedDate.getTime();

    interaction = createMockInteraction();
    (interaction.options.getSubcommand as jest.Mock).mockReturnValue(
      "language",
    );
  });

  afterAll(async () => {
    Date.now = realNow;
  });

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
});

function defaultEvent(): Event {
  return new Event(
    "1",
    "TestEvent",
    "TestEventDesc",
    "test",
    "#FF0000",
    "https://example.com/image.png",
    "This is an effect description for the test event.",
    new Date(Date.now() + 3600000),
  );
}
