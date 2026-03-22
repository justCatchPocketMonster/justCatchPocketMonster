import { BaseGuildTextChannel, Client, Message } from "discord.js";
import { newLogger } from "../middlewares/logger";
import { spawn } from "../features/spawn/spawn";
import { startRaid } from "../features/raid/raidManager";
import { registerSpawnMessage } from "../features/spawn/spawnMessageRegistry";
import { giveRandomPokemonToAllUsers } from "../features/dev/giveRandomPokemonToAllUsers";

export default async (client: Client, message: Message) => {
  try {
    if (message.author.bot) {
      return;
    }
    if (!message.guild) return;

    if (message.content.trim() === "!devGivePokemon") {
      const devId = process.env.DEV_ID?.trim() ?? "";
      if (
        process.env.ENVIRONMENT === "dev" &&
        devId.length > 0 &&
        message.author.id === devId
      ) {
        try {
          const { updatedCount, userCount } =
            await giveRandomPokemonToAllUsers();
          await message.reply(
            [
              "**Validation** — la commande `!devGivePokemon` s’est terminée sans erreur.",
              `Résumé : ${updatedCount} utilisateur(s) mis à jour sur ${userCount} en base.`,
            ].join("\n"),
          );
        } catch (err) {
          newLogger(
            "error",
            err instanceof Error ? err.message : String(err),
            `Error in !devGivePokemon for user ${message.author.id}`,
          );
          await message.reply("Erreur lors de l'exécution de !devGivePokemon.");
        }
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
