import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { ChatInputCommandInteraction, Interaction } from "discord.js";
import logger from "../../middlewares/error";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";
import { getUserById } from "../../cache/UserCache";

export default {
  name: "pokedex",
  command: new SlashCommandBuilder()
    .setName("pokedex")
    .setDescription(language("commandPokedexExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandPokedexExplication", "fr"),
    })
    .addStringOption(
      new SlashCommandStringOption()
        .setName(language("pokedexNameOptionStringPage", "eng"))
        .setNameLocalizations({
          fr: language("pokedexNameOptionStringPage", "fr"),
        })
        .setDescription(language("pokedexDescOptionStringPage", "eng"))
        .setDescriptionLocalizations({
          fr: language("pokedexDescOptionStringPage", "fr"),
        })
        .setRequired(false),
    ),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      // TODO: a faire de 0
      if (interaction.guildId === null) return;
      const server = await getServerById(interaction.guildId);
      const user = await getUserById(interaction.user.id);
    } catch (e) {
      logger.error(e);
    }
  },
};
