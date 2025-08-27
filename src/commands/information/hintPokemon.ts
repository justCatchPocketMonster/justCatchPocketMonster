import {
  SlashCommandBuilder,
  SlashCommandChannelOption,
} from "@discordjs/builders";
import { ChannelType, ChatInputCommandInteraction } from "discord.js";
import { newLogger } from "../../middlewares/logger";
import language from "../../lang/language";
import { getServerById, updateServer } from "../../cache/ServerCache";
import { createHint } from "../../features/hint/createHint";
import { capitalizeFirstLetter } from "../../utils/helperFunction";

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

      let channel = channelOption ?? interaction.channel;
      if (!channel) {
        return;
      }
      if (server.pokemonPresent[channel.id]?.hint) {
        server.pokemonPresent[channel.id].hint = createHint(
          server.pokemonPresent[channel.id].hint,
          server.pokemonPresent[channel.id].name[
            "name" + capitalizeFirstLetter(server.language)
          ][0],
        );
        await updateServer(server.discordId, server);
        interaction.reply({
          content:
            language("hintIs", server.language) +
            server.pokemonPresent[channel.id].hint +
            " " +
            language("forChannel", server.language) +
            channel.toString(),
        });
        return;
      }

      interaction.reply({
        content: language("noHint", server.language),
        ephemeral: true,
      });
      return;
    } catch (e) {
      newLogger(
        "error",
        e as string,
        `Error in hint command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  },
};
