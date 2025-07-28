import {BaseGuildTextChannel, Client, Message} from "discord.js";
import logger, {newLogger} from "../middlewares/logger";
import {spawn} from "../features/spawn/spawn";
import {checkTimeForResetEventStat} from "../features/event/checkTimeForResetEventStat";

export default async (client: Client, message: Message<boolean>) => {
  try {
    if (message.author.bot) {
      return;
    }
    if (!message.guild) return;

    checkTimeForResetEventStat(message.guild.id);
    spawn(message.guild.id, message.channel.id).then((result) => {
      if (result) {
        const channel = client.channels.cache.get(result.channelId);
        if (channel && channel.isTextBased() && channel instanceof BaseGuildTextChannel) {
          channel.send({embeds: [result.embed], files: [result.image]});

        }
      }
    });
  } catch (e) {
    newLogger(
        'error',
        e as string,
        `Error in messageCreate event for server ${message!.guild!.id} and channel ${message.channel.id}`,
    );
  }
};
