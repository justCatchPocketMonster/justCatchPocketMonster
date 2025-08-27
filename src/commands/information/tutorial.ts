import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { newLogger } from "../../middlewares/logger";
import language from "../../lang/language";
import {
  createPageForMenu,
  paginationMenu,
} from "../../features/other/paginationMenu";
import { getServerById } from "../../cache/ServerCache";

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
      let server = await getServerById(interaction.guildId);
      const pages = [];

      pages.push(
        createPageForMenu(
          new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle(language("tutorialTitle", server.language))
            .setDescription(language("tutorialDescription", server.language))
            .addFields(
              {
                name: language("tutorialField1Title", server.language),
                value: language("tutorialField1Desc", server.language),
                inline: false,
              },
              {
                name: language("tutorialField2Title", server.language),
                value: language("tutorialField2Desc", server.language),
                inline: false,
              },
              {
                name: language("tutorialField3Title", server.language),
                value: language("tutorialField3Desc", server.language),
                inline: false,
              },
            )
            .setImage(
              "https://cdn.discordapp.com/attachments/1150766647905366086/1150767117206036510/botGifTuto.gif",
            ),
          null,
          language("baseTutorialTitle", server.language),
        ),
      );

      pages.push(
        createPageForMenu(
          new EmbedBuilder()
            .setColor("#7B68EE")
            .setTitle(language("tutorialAdminTitle", server.language))
            .setDescription(
              language("tutorialAdminDescription", server.language),
            )
            .addFields(
              {
                name: language("tutorialAdminField1Title", server.language),
                value: language("tutorialAdminField1Desc", server.language),
                inline: false,
              },
              {
                name: language("tutorialAdminField2Title", server.language),
                value: language("tutorialAdminField2Desc", server.language),
                inline: false,
              },
            ),
          null,
          language("tutorialAdminTitle", server.language),
        ),
      );

      paginationMenu(
        interaction,
        language("selectAPage", server.language),
        pages,
      );
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
