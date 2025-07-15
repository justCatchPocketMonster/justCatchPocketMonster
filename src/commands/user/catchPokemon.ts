import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import logger from "../../middlewares/error";
import language from "../../lang/language";
import { catchPokemon } from "../../features/catch/catch";
import { getUserById } from "../../cache/UserCache";
import { getServerById } from "../../cache/ServerCache";

export default {
  name: "catch",
  command: new SlashCommandBuilder()
    .setName("catch")
    .setDescription(language("commandCatchExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandCatchExplication", "fr"),
    })
    .addStringOption(
      new SlashCommandStringOption()
        .setName(language("commandCatchOptionName", "eng"))
        .setNameLocalizations({
          fr: language("commandCatchOptionName", "fr"),
        })
        .setDescription(language("commandCatchOptionDesc", "eng"))
        .setDescriptionLocalizations({
          fr: language("commandCatchOptionDesc", "fr"),
        })
        .setRequired(true),
    ),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.guild) {
        return;
      }

      const user = await getUserById(interaction.user.id);
      const server = await getServerById(interaction.guild.id);
      catchPokemon(
        user,
        server,
        interaction.channelId,
        interaction.options.getString(
          language("commandCatchOptionName", "eng"),
        ) ?? "",
        interaction,
      );
    } catch (e) {
      logger.error(e);
    }
  },
};
