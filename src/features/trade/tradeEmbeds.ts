import { EmbedBuilder } from "discord.js";
import language from "../../lang/language";
import { TradeData } from "./tradeCache";
import allPokemon from "../../data/pokemon.json";
import type { pokemonDb } from "../../core/types/pokemonDb";
import type { ServerType } from "../../core/types/ServerType";
import type { UserType } from "../../core/types/UserType";

export function createTradeCompletedEmbed(
  trade: TradeData,
  server: ServerType,
  isInitiator: boolean,
  initiatorName: string,
  targetName: string,
  user: UserType,
): EmbedBuilder {
  const lang = server.settings.language;
  const embed = new EmbedBuilder()
    .setTitle(language("tradeCompleted", lang))
    .setColor(0x2ecc71);

  if (!trade.initiatorChoice || !trade.targetChoice) {
    return embed.setDescription(language("tradeCompletedDesc", lang));
  }

  const myChoice = isInitiator ? trade.initiatorChoice : trade.targetChoice;
  const receivedChoice = isInitiator
    ? trade.targetChoice
    : trade.initiatorChoice;

  const myPokemonData = (allPokemon as pokemonDb[]).find(
    (p) =>
      p.id.toString() === myChoice.pokemonId &&
      `${p.id}-${p.form}-${p.versionForm}` === myChoice.pokemonKey,
  );
  const receivedPokemonData = (allPokemon as pokemonDb[]).find(
    (p) =>
      p.id.toString() === receivedChoice.pokemonId &&
      `${p.id}-${p.form}-${p.versionForm}` === receivedChoice.pokemonKey,
  );

  if (!myPokemonData || !receivedPokemonData) {
    return embed.setDescription(language("tradeCompletedDesc", lang));
  }

  const completKey =
    `nameComplet${lang.charAt(0).toUpperCase() + lang.slice(1)}` as
      | "nameCompletFr"
      | "nameCompletEng";
  const myCompleteName = myPokemonData.name[completKey][0];
  const receivedCompleteName = receivedPokemonData.name[completKey][0];

  const myCount = user.savePokemon.data[myChoice.pokemonKey]?.normalCount || 0;
  const receivedCount =
    user.savePokemon.data[receivedChoice.pokemonKey]?.normalCount || 0;

  return embed.setDescription(language("tradeCompletedDesc", lang)).addFields(
    {
      name: language("tradeYouGive", lang),
      value: `${myCompleteName} (${myCount})`,
      inline: true,
    },
    {
      name: language("tradeYouReceive", lang),
      value: `${receivedCompleteName} (${receivedCount})`,
      inline: true,
    },
  );
}
