import adminSettingsCommand from "../../../../src/commands/admin/adminSettings";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById } from "../../../../src/cache/ServerCache";
import language from "../../../../src/lang/language";

jest.mock("../../../../src/middlewares/logger", () => ({
  newLogger: jest.fn(),
}));

describe("adminSettings command", () => {
  let interaction: any;

  beforeEach(async () => {
    await resetTestEnv();
    interaction = createMockInteraction();
    interaction.guild = {
      id: interaction.guildId,
      channels: {
        cache: new Map(),
      },
      members: {
        cache: new Map(),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as any;
  });

  test("should execute adminSettings command successfully", async () => {
    await adminSettingsCommand.execute(interaction);

    expect(interaction.reply).toHaveBeenCalled();
  });

  test("should handle error when guildId is missing", async () => {
    const interactionWithoutGuild = {
      ...interaction,
      guildId: null,
    } as any;

    await adminSettingsCommand.execute(interactionWithoutGuild);

    expect(interactionWithoutGuild.reply).not.toHaveBeenCalled();
  });

  test("should handle error during execution", async () => {
    const adminSettingsSpy = jest
      .spyOn(require("../../../../src/features/adminSettings/adminSettings"), "adminSettings")
      .mockRejectedValueOnce(new Error("Database error"));

    await adminSettingsCommand.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      language("errorCatch", "eng"),
    );

    adminSettingsSpy.mockRestore();
  });
});
