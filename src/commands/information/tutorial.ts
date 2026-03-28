import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { newLogger } from "../../middlewares/logger";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";
import { MenuSystem, MenuHandler } from "../../utils/menu";
import {
  CommandsTutorialHandler,
  GameplayTutorialHandler,
  AdminTutorialHandler,
} from "../../features/tutorial";

const TUTORIAL_IMAGE_URL =
  "https://cdn.discordapp.com/attachments/1150766647905366086/1150767117206036510/botGifTuto.gif";

export default {
  name: "tutorial",
  command: new SlashCommandBuilder()
    .setName("tutorial")
    .setNameLocalizations({
      fr: "tutoriel",
    })
    .setDescription(language("commandStatExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandHowIDoExplication", "fr"),
    }),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (interaction.guildId === null) return;
      const server = await getServerById(interaction.guildId);
      const lang = server.settings.language;

      const getMainEmbed = async (): Promise<EmbedBuilder> => {
        const freshServer = await getServerById(interaction.guildId!);
        const l = freshServer.settings.language;
        return new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(language("tutorialTitle", l))
          .setDescription(language("tutorialDescription", l))
          .setImage(TUTORIAL_IMAGE_URL);
      };

      const regenerateMenu = async (): Promise<Map<string, MenuHandler>> => {
        const freshServer = await getServerById(interaction.guildId!);
        const handlers = new Map<string, MenuHandler>();
        handlers.set("commands", new CommandsTutorialHandler(freshServer));
        handlers.set("gameplay", new GameplayTutorialHandler(freshServer));
        if (
          interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
        ) {
          handlers.set("admin", new AdminTutorialHandler(freshServer));
        }
        return handlers;
      };

      const menuSystem = new MenuSystem({
        regenerateMenu,
        getMainEmbed,
        mainMenuPlaceholder: language("tutorialMainPlaceholder", lang),
        mainMenuText: language("tutorialCategoryCommands", lang),
        subElementText: language("tutorialSubPlaceholder", lang),
        selectSubElementText: language("tutorialSubPlaceholder", lang),
        clickButtonConfirmText: "",
        subElementPlaceholder: language("tutorialSubPlaceholder", lang),
        lang,
        timeout: 60000,
      });

      await menuSystem.initialize(interaction);
    } catch (e) {
      newLogger(
        "error",
        e as string,
        `Error in tutorial command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  },
};
