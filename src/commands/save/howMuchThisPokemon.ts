import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import {newLogger} from "../../middlewares/logger";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";
import { getUserById } from "../../cache/UserCache";
import allPokemon from "../../data/pokemon.json";
import { howMuchThisPokemon } from "../../features/howMuchThisPokemon/howMuchThisPokemon";
import { getStatById } from "../../cache/StatCache";
import { version } from "../../config/default/misc";
import { ServerType } from "../../core/types/ServerType";

export default {
  name: "howmuch",
  command: new SlashCommandBuilder()
    .setName("howmuch")
    .setNameLocalizations({
      fr: "combien",
    })
    .setDescription(language("commandHowExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandHowExplication", "fr"),
    })
    .addStringOption(
      new SlashCommandStringOption()
        .setName(language("commandHowOptionNameStringNumber", "eng"))
        .setNameLocalizations({
          fr: language("commandHowOptionNameStringNumber", "fr"),
        })
        .setDescription(language("commandHowOptionDescStringNumber", "eng"))
        .setDescriptionLocalizations({
          fr: language("commandHowOptionDescStringNumber", "fr"),
        })
        .setRequired(false),
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName(language("commandHowOptionNameStringPokemonName", "eng"))
        .setNameLocalizations({
          fr: language("commandHowOptionNameStringPokemonName", "fr"),
        })
        .setDescription(
          language("commandHowOptionDescStringPokemonName", "eng"),
        )
        .setDescriptionLocalizations({
          fr: language("commandHowOptionDescStringPokemonName", "fr"),
        })
        .setRequired(false),
    ),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.guildId) return;

      const server = await getServerById(interaction.guildId);
      const user = await getUserById(interaction.user.id);
      const stat = await getStatById(version);

      const pokemonNameInput = interaction.options.getString(
        language("commandHowOptionNameStringPokemonName", "eng"),
      );
      const pokemonIdInput = interaction.options.getString(
        language("commandHowOptionNameStringNumber", "eng"),
      );

      const resolvedPokemonId = resolvePokemonId(
        pokemonNameInput,
        pokemonIdInput,
        server,
      );

      if (!resolvedPokemonId) {
        return;
      }

      howMuchThisPokemon(interaction, user, server, stat, resolvedPokemonId);

      function resolvePokemonId(
        pokemonNameInput: string | null,
        pokemonIdInput: string | null,
        server: ServerType,
      ): string | null {
        if (pokemonNameInput) {
          const matched = allPokemon.find(
            (p) =>
              p.id !== 0 &&
              (p.name.nameEng[0].toLowerCase() ===
                pokemonNameInput.toLowerCase() ||
                p.name.nameFr[0].toLowerCase() ===
                  pokemonNameInput.toLowerCase()),
          );

          if (!matched) {
            interaction.reply(language("notExist", server.language));
            return null;
          }

          return matched.id.toString();
        }

        if (pokemonIdInput) {
          const isValid = allPokemon.some(
            (p) => p.id !== 0 && p.id.toString() === pokemonIdInput,
          );
          if (!isValid) {
            interaction.reply(language("notExist", server.language));
            return null;
          }

          return pokemonIdInput;
        }

        interaction.reply(language("noArgument", server.language));
        return null;
      }
    } catch (e) {
      newLogger(
          'error',
          e as string,
          `Error in howMuch command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  },
};
