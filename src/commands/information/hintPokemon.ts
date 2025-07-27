import {
  SlashCommandBuilder,
  SlashCommandChannelOption,
} from "@discordjs/builders";
import { ChannelType, ChatInputCommandInteraction } from "discord.js";
import logger from "../../middlewares/error";
import language from "../../lang/language";
import { getServerById, updateServer } from "../../cache/ServerCache";
import {createHint} from "../../features/hint/createHint";

export default {
  name: "hint",
  command: new SlashCommandBuilder()
    .setName("hint")
    .setNameLocalizations({
      fr: "indice",
    })
    .setDescription(language("commandHintExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandHintExplication", "fr"),
    })
    .addChannelOption(
      new SlashCommandChannelOption()
        .setName("channel")
        .setNameLocalizations({
          fr: "salon",
        })
        .setDescription(language("commandHintOptionDescChannel", "eng"))
        .setDescriptionLocalizations({
          fr: language("commandHintOptionDescChannel", "fr"),
        })
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false),
    ),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.guildId) {
        return;
      }
      let server = await getServerById(interaction.guildId);
      let channelOption = interaction.options.getChannel("channel");

      let channel = channelOption ? channelOption : interaction.channel;
      if (!channel) {
        return;
      }
      if (
        server.pokemonPresent[channel.id] &&
        server.pokemonPresent[channel.id].hint
      ) {
        server.pokemonPresent[channel.id].hint = createHint(
          server.pokemonPresent[channel.id].hint,
          server.pokemonPresent[channel.id].name.nameEng[0],
        );
        await updateServer(server.discordId, server);
        return;
      }

      interaction.reply({
        content: language(interaction.guildId, "noHint"),
        ephemeral: true,
      });
      return;
    } catch (e) {
      logger.error(e);
    }
  },
};
