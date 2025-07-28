import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import {ChatInputCommandInteraction, Interaction, SlashCommandNumberOption} from "discord.js";
import logger, {newLogger} from "../../middlewares/logger";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";
import { getUserById } from "../../cache/UserCache";
import {pokedex} from "../../features/pokedex/pokedex";

export default {
  name: "pokedex",
  command: new SlashCommandBuilder()
    .setName("pokedex")
    .setDescription(language("commandPokedexExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandPokedexExplication", "fr"),
    })
    .addNumberOption(option =>
        option
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
      if (interaction.guildId === null) return;
      const server = await getServerById(interaction.guildId);
      const user = await getUserById(interaction.user.id);

      const numberPage = interaction.options.getNumber(
        language("pokedexNameOptionStringPage", "eng"),
      );

      pokedex(interaction, user, server,numberPage )
    } catch (e) {
      newLogger(
          'error',
          e as string,
          `Error in pokedex command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  },
};
