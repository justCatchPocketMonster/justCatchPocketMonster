import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import langue from "../../../../src/commands/admin/langue";
import language from "../../../../src/lang/language";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById } from "../../../../src/cache/ServerCache";

describe("language command", () => {
  let interaction: any;
  beforeEach(async () => {
    await resetTestEnv();

    interaction = createMockInteraction();
    (interaction.options.getSubcommand as jest.Mock).mockReturnValue(
      "language",
    );
  });

  afterAll(async () => {});

  test("Change language", async () => {
    // given
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("langNameOptionString", "eng")) return "fr";
        return null;
      },
    );

    // when
    await langue.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;
    const serverThen = await getServerById(interaction.guild.id);

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith({
      content: language("langIsChanged", "fr"),
    });
    expect(serverThen.settings.language).toBe("fr");
  });

  test("Failed to change language because no option", async () => {
    // given

    // when
    await langue.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;
    const serverThen = await getServerById(interaction.guild.id);

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith({
      content: language("langErrorNoOption", "eng"),
    });
    expect(serverThen.settings.language).toBe("eng");
  });

  test("should handle error when guildId is missing", async () => {
    const interactionWithoutGuild = {
      ...interaction,
      guildId: null,
    } as any;

    await langue.execute(interactionWithoutGuild);

    expect(interactionWithoutGuild.reply).not.toHaveBeenCalled();
  });

  test("should handle error during execution", async () => {
    const getServerByIdSpy = jest
      .spyOn(require("../../../../src/cache/ServerCache"), "getServerById")
      .mockRejectedValueOnce(new Error("Database error"));

    await langue.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      language("errorCatch", "eng"),
    );

    getServerByIdSpy.mockRestore();
  });
});
