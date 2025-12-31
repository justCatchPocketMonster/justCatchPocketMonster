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
            .setTitle(language("tutorialTitle", server.settings.language))
            .setDescription(
              language("tutorialDescription", server.settings.language),
            )
            .addFields(
              {
                name: language("tutorialField1Title", server.settings.language),
                value: language("tutorialField1Desc", server.settings.language),
                inline: false,
              },
              {
                name: language("tutorialField2Title", server.settings.language),
                value: language("tutorialField2Desc", server.settings.language),
                inline: false,
              },
              {
                name: language("tutorialField3Title", server.settings.language),
                value: language("tutorialField3Desc", server.settings.language),
                inline: false,
              },
            )
            .setImage(
              "https://cdn.discordapp.com/attachments/1150766647905366086/1150767117206036510/botGifTuto.gif",
            ),
          null,
          language("baseTutorialTitle", server.settings.language),
        ),
      );

      pages.push(
        createPageForMenu(
          new EmbedBuilder()
            .setColor("#7B68EE")
            .setTitle(language("tutorialAdminTitle", server.settings.language))
            .setDescription(
              language("tutorialAdminDescription", server.settings.language),
            )
            .addFields(
              {
                name: language(
                  "tutorialAdminField1Title",
                  server.settings.language,
                ),
                value: language(
                  "tutorialAdminField1Desc",
                  server.settings.language,
                ),
                inline: false,
              },
              {
                name: language(
                  "tutorialAdminField2Title",
                  server.settings.language,
                ),
                value: language(
                  "tutorialAdminField2Desc",
                  server.settings.language,
                ),
                inline: false,
              },
            ),
          null,
          language("tutorialAdminTitle", server.settings.language),
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
        `Error in tutorial command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  },
};
