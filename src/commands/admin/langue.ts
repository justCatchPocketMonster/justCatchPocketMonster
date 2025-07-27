import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { PermissionFlagsBits, ChatInputCommandInteraction } from "discord.js";
import logger from "../../middlewares/error";
import { getServerById, updateServer } from "../../cache/ServerCache";
import language from "../../lang/language";

export default {
  name: language("commandLangName", "eng"),
  command: new SlashCommandBuilder()
    .setName(language("commandLangName", "eng"))
    .setNameLocalizations({
      fr: language("commandLangName", "fr"),
    })
    .setDescription(language("commandLangExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandLangExplication", "fr"),
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(
      new SlashCommandStringOption()
        .setName(language("langNameOptionString", "eng"))
        .setNameLocalizations({
          fr: language("langNameOptionString", "fr"),
        })
        .setDescription(language("langDescOptionString", "eng"))
        .setDescriptionLocalizations({
          fr: language("langDescOptionString", "fr"),
        })
        .addChoices(
          { name: "English", value: "eng" },
          { name: "Français", value: "fr" },
        )
        .setRequired(true),
    )
    .setDefaultMemberPermissions(0),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.guildId) {
        return;
      }
      let server = await getServerById(interaction.guildId);

      const langOption = interaction.options.getString(
        language("langNameOptionString", "eng"),
      );

      if(!langOption) {
        interaction.reply({
          content: language("langErrorNoOption", server.language),
        });
        return;
      }

      server.language = langOption.toLowerCase() ?? "eng";
      interaction.reply({
        content: language("langIsChanged", server.language),
      });
      updateServer(server.discordId, server);
    } catch (e) {
      logger.error(e);
    }
  },
};
