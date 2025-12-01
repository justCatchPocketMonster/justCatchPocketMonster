import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { newLogger } from "../../middlewares/logger";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";
import {
  createPageForMenu,
  paginationMenu,
} from "../../features/other/paginationMenu";
import { codeListEmbed } from "../../features/code/code";
import { getUserById } from "../../cache/UserCache";
import { embedRequiredinformation } from "../../utils/embedRequiredinformation";
import { getStatById } from "../../cache/StatCache";
import { nameStatGeneral } from "../../config/default/misc";

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
      const stat = await getStatById(nameStatGeneral);

      const pages = [];

      const mainPage = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Information")
        .setDescription(
          language("informationDescription", server.settings.language),
        );
      pages.push(
        createPageForMenu(
          mainPage,
          null,
          language("principalPage", server.settings.language),
        ),
      );

      pages.push(
        createPageForMenu(
          embedRequiredinformation(server),
          null,
          language("mentionObligatoireTitle", server.settings.language),
          language("mentionObligatoireDesc", server.settings.language),
        ),
      );
      pages.push(
        createPageForMenu(
          codeListEmbed(user, server, stat),
          null,
          language("codeListEmbedTitle", server.settings.language),
          language("codeListEmbedDescription", server.settings.language),
        ),
      );

      paginationMenu(
        interaction,
        language("selectAPage", server.settings.language),
        pages,
      );
    } catch (e) {
      newLogger(
        "error",
        e as string,
        `Error in information command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  },
};
