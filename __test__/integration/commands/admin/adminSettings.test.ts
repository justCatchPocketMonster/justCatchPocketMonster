import { adminSettings } from "../../../../src/features/adminSettings/adminSettings";
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

  test("should initialize adminSettings menu", async () => {
    const server = await getServerById(interaction.guildId!);

    await adminSettings(interaction, server);

    expect(interaction.reply).toHaveBeenCalled();
    const replyCall = (interaction.reply as jest.Mock).mock.calls[0][0];
    expect(replyCall.embeds).toBeDefined();
    expect(replyCall.embeds.length).toBeGreaterThan(0);
  });

  test("should prevent multiple instances for same server", async () => {
    const server = await getServerById(interaction.guildId!);

    await adminSettings(interaction, server);

    const interaction2 = {
      ...createMockInteraction(),
      guildId: interaction.guildId,
      guild: interaction.guild,
    } as any;

    await adminSettings(interaction2, server);

    const replyCalls = (interaction2.reply as jest.Mock).mock.calls;
    const lastCall = replyCalls[replyCalls.length - 1][0];
    expect(lastCall.content).toBe(
      language("adminSettingsAlreadyActive", server.settings.language),
    );
    expect(lastCall.ephemeral).toBe(true);
  });

  test("should create menu with correct embed", async () => {
    const server = await getServerById(interaction.guildId!);

    await adminSettings(interaction, server);

    expect(interaction.reply).toHaveBeenCalled();
    const replyCall = (interaction.reply as jest.Mock).mock.calls[0][0];
    expect(replyCall).toBeDefined();
    expect(replyCall.embeds || replyCall.content).toBeDefined();
  });

  test("should handle adminSettings without guild", async () => {
    const server = await getServerById(interaction.guildId!);
    interaction.guild = null;

    await adminSettings(interaction, server);

    expect(interaction.reply).toHaveBeenCalled();
  });

  test("should cleanup on error", async () => {
    const server = await getServerById(interaction.guildId!);
    (interaction.reply as jest.Mock).mockRejectedValueOnce(
      new Error("Test error"),
    );

    await expect(adminSettings(interaction, server)).rejects.toThrow(
      "Test error",
    );

    // Should be able to create a new instance after cleanup
    const interaction2 = {
      ...createMockInteraction(),
      guildId: interaction.guildId,
      guild: interaction.guild,
    } as any;
    await adminSettings(interaction2, server);
    expect(interaction2.reply).toHaveBeenCalled();
  });
});
