import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Server } from "../../core/classes/Server";
import { MenuHandler, MenuSystem } from "../../utils/menu";
import {
  createShowValuesButton,
  handleButtonClick,
  countChannelsWithPermissions,
} from "./utils";
import { MinSpawnsHandler } from "./MinSpawnsHandler";
import { MaxSpawnsHandler } from "./MaxSpawnsHandler";
import { LanguageHandler } from "./LanguageHandler";
import { SpawnHandler } from "./SpawnHandler";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";

const activeAdminSettings = new Map<string, MenuSystem<MenuHandler>>();

function createMenuHandlers(
  server: Server,
  interaction: ChatInputCommandInteraction,
): Map<string, MenuHandler> {
  const handlers = new Map<string, MenuHandler>();
  handlers.set("minSpawns", new MinSpawnsHandler(server));
  handlers.set("maxSpawns", new MaxSpawnsHandler(server));
  handlers.set("language", new LanguageHandler(server));
  const spawnHandlerInstance = new SpawnHandler(server, interaction);
  handlers.set("spawn", spawnHandlerInstance);
  return handlers;
}

export async function adminSettings(
  interaction: ChatInputCommandInteraction,
  server: Server,
) {
  const serverId = server.discordId;

  if (activeAdminSettings.has(serverId)) {
    await interaction.reply({
      content: language("adminSettingsAlreadyActive", server.settings.language),
      ephemeral: true,
    });
    return;
  }

  const lang = server.settings.language;

  const getMainEmbed = async (): Promise<EmbedBuilder> => {
    const serverMain = await getServerById(server.discordId);
    const embed = new EmbedBuilder()
      .setTitle(language("adminSettingsTitle", serverMain.settings.language))
      .setDescription(
        language("adminSettingsSelectMainOption", serverMain.settings.language),
      )
      .setColor(0x0099ff);

    const lang = serverMain.settings.language;

    const minSpawns = serverMain.eventSpawn.messageSpawn.min;
    embed.addFields({
      name: language("adminSettingsMinSpawnsLabel", lang),
      value: minSpawns.toString(),
      inline: true,
    });

    const maxSpawns = serverMain.settings.spawnMax;
    embed.addFields({
      name: language("adminSettingsMaxSpawnsLabel", lang),
      value: maxSpawns.toString(),
      inline: true,
    });

    const languageName =
      serverMain.settings.language === "fr" ? "Français" : "English";
    embed.addFields({
      name: language("adminSettingsLanguageLabel", lang),
      value: languageName,
      inline: true,
    });

    if (interaction.guild) {
      const { goodCount, totalCount } = countChannelsWithPermissions(
        interaction.guild,
        serverMain.channelAllowed,
      );

      embed.addFields({
        name: language("adminSettingsSpawnEmbedPermissionsCount", lang)
          .replace("{goodCount}", goodCount.toString())
          .replace("{totalCount}", totalCount.toString()),
        value: language("adminSettingsSpawnLabel", lang),
        inline: false,
      });
    }

    return embed;
  };

  const cleanup = () => {
    activeAdminSettings.delete(serverId);
  };

  const menuSystem = new MenuSystem({
    regenerateMenu: async () => {
      const freshServer = await getServerById(server.discordId);
      const freshHandlers = createMenuHandlers(freshServer, interaction);
      return freshHandlers;
    },
    getMainEmbed: getMainEmbed,
    mainMenuPlaceholder: language(
      "adminSettingsSelectMainMenuPlaceholder",
      lang,
    ),
    mainMenuText: language("adminSettingsMainMenu", lang),
    subElementText: language("adminSettingsSubElement", lang),
    selectSubElementText: language("adminSettingsSelectSubElement", lang),
    clickButtonConfirmText: language("adminSettingsClickButtonConfirm", lang),
    subElementPlaceholder: language(
      "adminSettingsSelectSubElementPlaceholder",
      lang,
    ),
    lang: lang,
    createConfirmButton: createShowValuesButton,
    onButtonClick: handleButtonClick,
    resetOnButtonClick: true,
    timeout: 60000,
    onEnd: cleanup,
  });

  activeAdminSettings.set(serverId, menuSystem);

  try {
    await menuSystem.initialize(interaction);
  } catch (error) {
    cleanup();
    throw error;
  }
}
