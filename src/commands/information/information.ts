import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Interaction,
} from "discord.js";
import logger from "../../middlewares/error";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";
import {
  createPageForMenu,
  paginationMenu,
} from "../../features/other/paginationMenu";
import { codeListEmbed } from "../../features/code/code";
import { getUserById } from "../../cache/UserCache";
import { embedRequiredinformation } from "../../utils/embedRequiredinformation";

export default {
  name: "information",
  command: new SlashCommandBuilder()
    .setName("information")
    .setDescription(language("commandInformationExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandInformationExplication", "fr"),
    }),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (interaction.guildId === null) return;
      let server = await getServerById(interaction.guildId);
      let user = await getUserById(interaction.user.id);
      const pages = [];

      const mainPage = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Information")
        .setDescription(language("informationDescription", server.language));
      pages.push(
        createPageForMenu(
          mainPage,
          null,
          language("principalPage", server.language),
        ),
      );

      pages.push(
        createPageForMenu(
          embedRequiredinformation(server),
          null,
          language("mentionObligatoireTitle", server.language),
          language("mentionObligatoireDesc", server.language),
        ),
      );
      pages.push(
        createPageForMenu(
          codeListEmbed(user, server),
          null,
          language("codeListEmbedTitle", server.language),
          language("codeListEmbedDescription", server.language),
        ),
      );

      paginationMenu(
        interaction,
        language("selectAPage", server.language),
        pages,
      );
    } catch (e) {
      logger.error(e);
    }
  },
};
