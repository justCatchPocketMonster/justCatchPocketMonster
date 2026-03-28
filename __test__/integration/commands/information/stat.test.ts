import mongoose from "mongoose";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import stat from "../../../../src/commands/information/stat";

describe("stat command", () => {
  let interaction: any;
  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const name of Object.keys(collections)) {
      await collections[name].deleteMany({});
    }
    interaction = createMockInteraction();
    (interaction.options.getSubcommand as jest.Mock).mockReturnValue("stat");
  });

  afterAll(async () => {});

  test("Should return early when guildId is null", async () => {
    interaction.guildId = null;

    await stat.execute(interaction);

    expect(interaction.reply).not.toHaveBeenCalled();
  });

  test("Should reply a message because it's a success", async () => {
    // given

    // when
    await stat.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
  });
});
