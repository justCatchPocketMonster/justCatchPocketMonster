import { ChatInputCommandInteraction, EmbedBuilder, BaseGuildTextChannel, PermissionFlagsBits } from "discord.js";
import { Server } from "../../core/classes/Server";
import { MenuHandler, MenuSystem, MenuOption, SelectionPath } from "../../utils/menu";
import {
  createShowValuesButton,
  handleButtonClick,
} from "./utils";
import { minSpawnsHandler } from "./minSpawnsHandler";
import { maxSpawnsHandler } from "./maxSpawnsHandler";
import { languageHandler } from "./languageHandler";
import { spawnHandler } from "./spawnHandler";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";

const activeAdminSettings = new Map<string, MenuSystem<MenuHandler>>();

function createMenuHandlers(server: Server, interaction: ChatInputCommandInteraction): Map<string, MenuHandler> {
  const handlers = new Map<string, MenuHandler>();
  handlers.set("minSpawns", new minSpawnsHandler(server));
  handlers.set("maxSpawns", new maxSpawnsHandler(server));
  handlers.set("language", new languageHandler(server));
  const spawnHandlerInstance = new spawnHandler(server, interaction);
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
      .setDescription(language("adminSettingsSelectMainOption", serverMain.settings.language))
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

    const languageName = serverMain.settings.language === "fr" ? "Français" : "English";
    embed.addFields({
      name: language("adminSettingsLanguageLabel", lang),
      value: languageName,
      inline: true,
    });

    if (interaction.guild) {
      let goodPermissionsCount = 0;
      let totalCount = 0;
      const botMember = interaction.guild.members.cache.get(interaction.guild.client.user?.id);

      serverMain.channelAllowed.forEach((channelId: string) => {
        totalCount++;
        const channel = interaction.guild!.channels.cache.get(channelId);
        
        if (!channel) {
          return;
        }

        if (!channel.isTextBased() || !(channel instanceof BaseGuildTextChannel)) {
          return;
        }

        if (botMember) {
          const permissions = botMember.permissionsIn(channel);
          const hasPermission = permissions.has(PermissionFlagsBits.SendMessages) && 
                               permissions.has(PermissionFlagsBits.ViewChannel);
          if (hasPermission) {
            goodPermissionsCount++;
          }
        }
      });

      embed.addFields({
        name: language("adminSettingsSpawnEmbedPermissionsCount", lang)
          .replace("{goodCount}", goodPermissionsCount.toString())
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
    mainMenuPlaceholder: language("adminSettingsSelectMainMenuPlaceholder", lang),
    mainMenuText: language("adminSettingsMainMenu", lang),
    subElementText: language("adminSettingsSubElement", lang),
    selectSubElementText: language("adminSettingsSelectSubElement", lang),
    clickButtonConfirmText: language("adminSettingsClickButtonConfirm", lang),
    subElementPlaceholder: language("adminSettingsSelectSubElementPlaceholder", lang),
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
