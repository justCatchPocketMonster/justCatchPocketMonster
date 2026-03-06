import { BaseGuildTextChannel, Client, Message } from "discord.js";
import { newLogger } from "../middlewares/logger";
import { spawn } from "../features/spawn/spawn";
import { startRaid } from "../features/raid/raidManager";

export default async (client: Client, message: Message) => {
  try {
    if (message.author.bot) {
      return;
    }
    if (!message.guild) return;

    const result = await spawn(message.guild.id, message.channel.id);

    if (!result) return;

    const channel = client.channels.cache.get(result.channelId);
    if (
      !channel ||
      !channel.isTextBased() ||
      !(channel instanceof BaseGuildTextChannel)
    )
      return;

    if (result.image) {
      const sentMessage = await channel.send({
        embeds: [result.embed],
        files: [result.image],
      });

      if (result.isRaid && result.raidPokemon) {
        startRaid(
          client,
          message.guild.id,
          result.channelId,
          result.raidPokemon,
          sentMessage.id,
        );
      }
    } else {
      const sentMessage = await channel.send({ embeds: [result.embed] });

      if (result.isRaid && result.raidPokemon) {
        startRaid(
          client,
          message.guild.id,
          result.channelId,
          result.raidPokemon,
          sentMessage.id,
        );
      }
    }
  } catch (e) {
    newLogger(
      "error",
      e as string,
      `Error in messageCreate event for server ${message.guild!.id} and channel ${message.channel.id}`,
    );
  }
};
