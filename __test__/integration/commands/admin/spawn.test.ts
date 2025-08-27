import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import spawn from "../../../../src/commands/admin/spawn";
import mongoose from "mongoose";
import language from "../../../../src/lang/language";
import { getServerById, updateServer } from "../../../../src/cache/ServerCache";
import { cache as serverCache } from "../../../../src/cache/ServerCache";
import { resetTestEnv } from "../../../utils/resetTestEnv";

describe("spawn command", () => {
  let interaction: any;
  beforeEach(async () => {
    await resetTestEnv();

    interaction = createMockInteraction();
    (interaction.options.getSubcommand as jest.Mock).mockReturnValue("spawn");
  });

  afterAll(async () => {});

  test("Add channel", async () => {
    // given
    (interaction.options.getBoolean as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("spawnNameOptionBool", "eng")) return true;
        return null;
      },
    );

    // when
    await spawn.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;
    const serverThen = await getServerById(interaction.guild.id);

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith({
      content: language("spawnPokemonActivate", serverThen.language),
    });
    expect(serverThen.channelAllowed).toContain(interaction.channel.id);
  });

  test("Remove channel", async () => {
    // given
    const serverGiven = await getServerById(interaction.guild.id);
    serverGiven.channelAllowed.push(interaction.channel.id);
    await updateServer(serverGiven.discordId, serverGiven);
    (interaction.options.getBoolean as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("spawnNameOptionBool", "eng")) return false;
        return null;
      },
    );

    // when
    await spawn.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;
    const serverThen = await getServerById(interaction.guild.id);

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith({
      content: language("spawnPokemonDesactivate", serverThen.language),
    });
    expect(serverThen.channelAllowed).not.toContain(interaction.channel.id);
  });

  test("Failed to add channel because he's not exist", async () => {
    // given
    const serverGiven = await getServerById(interaction.guild.id);
    serverGiven.channelAllowed.push(interaction.channel.id);
    await updateServer(serverGiven.discordId, serverGiven);
    (interaction.options.getBoolean as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("spawnNameOptionBool", "eng")) return true;
        return null;
      },
    );

    // when
    await spawn.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;
    const serverThen = await getServerById(interaction.guild.id);

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith({
      content: language("spawnPokemonAlreadyActivate", serverThen.language),
    });
    expect(serverThen.channelAllowed).toContain(interaction.channel.id);
  });

  test("Failed to remove channel because he already not exist", async () => {
    // given
    (interaction.options.getBoolean as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("spawnNameOptionBool", "eng")) return false;
        return null;
      },
    );

    // when
    await spawn.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;
    const serverThen = await getServerById(interaction.guild.id);

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith({
      content: language("spawnPokemonAlreadyDesactivate", serverThen.language),
    });
    expect(serverThen.channelAllowed).not.toContain(interaction.channel.id);
  });
});
