import { Client, BaseGuildTextChannel } from "discord.js";
import { PokemonType } from "../../core/types/PokemonType";
import { Pokemon } from "../../core/classes/Pokemon";
import { getServerById, updateServer } from "../../cache/ServerCache";
import { getUserById, updateUser } from "../../cache/UserCache";
import { getStatById, updateStat } from "../../cache/StatCache";
import { nameStatGeneral, version } from "../../config/default/misc";
import { generateRaidEmbed, generateRaidEndEmbed } from "./raidEmbed";
import logger from "../../middlewares/logger";

const RAID_DURATION_MS = 2 * 60 * 1000;
const MAX_PLAYERS = 4;
const CATCH_RATE_PER_PLAYER = 0.25;

export interface RaidState {
  serverId: string;
  channelId: string;
  pokemon: PokemonType;
  players: string[];
  messageId: string;
  timer: ReturnType<typeof setTimeout>;
  endTimestamp: number;
}

const activeRaids = new Map<string, RaidState>();

export function getActiveRaid(serverId: string): RaidState | undefined {
  return activeRaids.get(serverId);
}

export function isChannelInRaid(serverId: string, channelId: string): boolean {
  const raid = activeRaids.get(serverId);
  return raid !== undefined && raid.channelId === channelId;
}

export function startRaid(
  client: Client,
  serverId: string,
  channelId: string,
  pokemon: PokemonType,
  messageId: string,
): RaidState {
  const endTimestamp = Math.floor((Date.now() + RAID_DURATION_MS) / 1000);

  const timer = setTimeout(() => {
    resolveRaid(client, serverId).catch((e) => logger.error(e));
  }, RAID_DURATION_MS);

  const raid: RaidState = {
    serverId,
    channelId,
    pokemon,
    players: [],
    messageId,
    timer,
    endTimestamp,
  };

  activeRaids.set(serverId, raid);
  return raid;
}

export function joinRaid(
  serverId: string,
  userId: string,
): { joined: boolean; raid: RaidState | undefined } {
  const raid = activeRaids.get(serverId);
  if (!raid) return { joined: false, raid: undefined };

  if (raid.players.includes(userId)) {
    return { joined: false, raid };
  }

  if (raid.players.length >= MAX_PLAYERS) {
    return { joined: false, raid };
  }

  raid.players.push(userId);
  return { joined: true, raid };
}

export function isRaidFull(serverId: string): boolean {
  const raid = activeRaids.get(serverId);
  return raid !== undefined && raid.players.length >= MAX_PLAYERS;
}

export async function updateRaidEmbed(
  client: Client,
  serverId: string,
): Promise<void> {
  const raid = activeRaids.get(serverId);
  if (!raid) return;

  try {
    const server = await getServerById(serverId);
    const { embed } = generateRaidEmbed(
      raid.pokemon,
      server,
      raid.players,
      raid.endTimestamp,
    );

    const channel = client.channels.cache.get(raid.channelId);
    if (channel && channel instanceof BaseGuildTextChannel) {
      const message = await channel.messages.fetch(raid.messageId);
      await message.edit({ embeds: [embed] });
    }
  } catch (e) {
    logger.error(e);
  }
}

export async function resolveRaid(
  client: Client,
  serverId: string,
): Promise<void> {
  const raid = activeRaids.get(serverId);
  if (!raid) return;

  clearTimeout(raid.timer);
  activeRaids.delete(serverId);

  const playerCount = raid.players.length;
  const catchRate = CATCH_RATE_PER_PLAYER * playerCount;
  const success = playerCount > 0 && Math.random() < catchRate;

  try {
    const server = await getServerById(serverId);
    const statVersion = await getStatById(version);
    const statAll = await getStatById(nameStatGeneral);

    if (success) {
      const pokemon = Pokemon.from(raid.pokemon);

      for (const userId of raid.players) {
        const user = await getUserById(userId);
        user.savePokemon.addOneCatch(pokemon);
        await updateUser(userId, user);
      }

      server.savePokemon.addOneCatch(pokemon);
      statVersion.addCatch(pokemon);
      statAll.addCatch(pokemon);
    }

    server.removePokemonByIdChannel(raid.channelId);

    await updateServer(serverId, server);
    await updateStat(version, statVersion);
    await updateStat(nameStatGeneral, statAll);

    const endEmbed = generateRaidEndEmbed(
      raid.pokemon,
      server,
      raid.players,
      success,
    );

    const channel = client.channels.cache.get(raid.channelId);
    if (channel && channel instanceof BaseGuildTextChannel) {
      try {
        const message = await channel.messages.fetch(raid.messageId);
        await message.edit({ embeds: [endEmbed] });
      } catch {
        await channel.send({ embeds: [endEmbed] });
      }
    }
  } catch (e) {
    logger.error(e);
  }
}
