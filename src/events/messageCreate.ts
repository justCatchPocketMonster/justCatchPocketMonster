import { BaseGuildTextChannel, Client, Message } from "discord.js";
import { newLogger } from "../middlewares/logger";
import { spawn } from "../features/spawn/spawn";
import { startRaid } from "../features/raid/raidManager";
import { registerSpawnMessage } from "../features/spawn/spawnMessageRegistry";
import {
  giveRandomPokemonToAllUsersFromDiscord,
  isDevGivePokemonCommandAllowed,
} from "../features/dev/giveRandomPokemonToAllUsers";

const DEV_GIVE_POKEMON_PREFIX = "!devGivePokemon";

export default async (client: Client, message: Message) => {
  try {
    if (message.author.bot) {
      return;
    }
    if (!message.guild) return;

    if (
      message.content.trim() === DEV_GIVE_POKEMON_PREFIX &&
      isDevGivePokemonCommandAllowed(message.author.id)
    ) {
      try {
        const outcome = await giveRandomPokemonToAllUsersFromDiscord();
        if (outcome.status === "busy") {
          await message.reply("Une exécution est déjà en cours.");
        } else {
          await message.reply(
            `Terminé : ${outcome.updatedCount} utilisateur(s) mis à jour, ${outcome.skippedCount} ignoré(s).`,
          );
        }
      } catch (e) {
        newLogger(
          "error",
          e instanceof Error ? e.message : String(e),
          `Error in devGivePokemon for user ${message.author.id}`,
        );
        await message.reply("Erreur lors de l'exécution.");
      }
      return;
    }

    const result = await spawn(message.guild.id, message.channel.id);

    if (!result) return;

    const channel = client.channels.cache.get(result.channelId);
    if (
      !channel ||
      !channel.isTextBased() ||
      !(channel instanceof BaseGuildTextChannel)
    )
      return;

    const sentMessage = await channel.send(
      result.image
        ? { embeds: [result.embed], files: [result.image] }
        : { embeds: [result.embed] },
    );

    if (result.isRaid && result.raidPokemon) {
      startRaid(
        client,
        message.guild.id,
        result.channelId,
        result.raidPokemon,
        sentMessage.id,
      );
    } else {
      registerSpawnMessage(message.guild.id, result.channelId, sentMessage.id);
    }
  } catch (e) {
    newLogger(
      "error",
      e instanceof Error ? e.message : String(e),
      `Error in messageCreate event for server ${message.guild?.id} and channel ${message.channel.id}`,
    );
  }
};
