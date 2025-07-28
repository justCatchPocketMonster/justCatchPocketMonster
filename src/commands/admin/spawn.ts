import {
  SlashCommandBuilder,
  SlashCommandBooleanOption,
  SlashCommandChannelOption,
} from "@discordjs/builders";
import {
  PermissionFlagsBits,
  CategoryChannel,
  GuildTextBasedChannel,
  ChannelType,
  ChatInputCommandInteraction,
} from "discord.js";
import logger, {newLogger} from "../../middlewares/logger";
import { getServerById, updateServer } from "../../cache/ServerCache";
import language from "../../lang/language";

export default {
  name: "spawn",
  command: new SlashCommandBuilder()
    .setName("spawn")
    .setDescription(language("commandSpawnExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandSpawnExplication", "fr"),
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption(
      new SlashCommandBooleanOption()
        .setName(language("spawnNameOptionBool", "eng"))
        .setNameLocalizations({
          fr: language("spawnNameOptionBool", "fr"),
        })
        .setDescription(language("spawnDescOptionBool", "eng"))
        .setDescriptionLocalizations({
          fr: language("spawnDescOptionBool", "fr"),
        })
        .setRequired(true),
    )
    .addChannelOption(
      new SlashCommandChannelOption()
        .setName(language("spawnNameOptionChannel", "eng"))
        .setNameLocalizations({
          fr: language("spawnNameOptionChannel", "fr"),
        })
        .setDescription(language("spawnDescOptionChannel", "eng"))
        .setDescriptionLocalizations({
          fr: language("spawnDescOptionChannel", "fr"),
        })
        //.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false),
    ),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const guildId = interaction.guildId;
      if (!guildId) return;

      const server = await getServerById(guildId);
      if (!interaction.channel) throw new Error("Channel not found");

      const lang = server.language;
      const boolOption = interaction.options.getBoolean(language("spawnNameOptionBool", "eng"));
      const channelOption = interaction.options.getChannel(language("spawnNameOptionChannel", "eng"));
      const channel = channelOption ?? interaction.channel;

      const isAllowed = server.channelAllowed.includes(channel.id);

      if (isAllowed) {
        if (boolOption) {
          await interaction.reply({
            content: language("spawnPokemonAlreadyActivate", lang),
          });
        } else {
          server.channelAllowed = server.channelAllowed.filter(id => id !== channel.id);
          await updateServer(server.discordId, server);

          await interaction.reply({
            content: language("spawnPokemonDesactivate", lang),
          });
        }
        return;
      }

      if (boolOption) {
        server.channelAllowed.push(channel.id);
        await updateServer(server.discordId, server);

        await interaction.reply({
          content: language("spawnPokemonActivate", lang),
        });
      } else {
        await interaction.reply({
          content: language("spawnPokemonAlreadyDesactivate", lang),
        });
      }

    } catch (e) {
      newLogger(
          'error',
          e as string,
          `Error in spawn command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  }
};
