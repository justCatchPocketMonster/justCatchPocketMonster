import { EmbedBuilder } from "discord.js";
import language from "../../lang/language";
import { TradeData } from "./tradeCache";
import allPokemon from "../../data/pokemon.json";

export function createTradeCompletedEmbed(
  trade: TradeData,
  server: any,
  isInitiator: boolean,
  initiatorName: string,
  targetName: string,
  user: any,
): EmbedBuilder {
  const lang = server.settings.language;
  const embed = new EmbedBuilder()
    .setTitle(language("tradeCompleted", lang))
    .setColor(0x2ecc71);

  if (!trade.initiatorChoice || !trade.targetChoice) {
    return embed.setDescription(language("tradeCompletedDesc", lang));
  }

  const myChoice = isInitiator ? trade.initiatorChoice : trade.targetChoice;
  const receivedChoice = isInitiator ? trade.targetChoice : trade.initiatorChoice;

  const myPokemonData = allPokemon.find(
    (p) =>
      p.id.toString() === myChoice.pokemonId &&
      `${p.id}-${p.form}-${p.versionForm}` === myChoice.pokemonKey,
  );
  const receivedPokemonData = allPokemon.find(
    (p) =>
      p.id.toString() === receivedChoice.pokemonId &&
      `${p.id}-${p.form}-${p.versionForm}` === receivedChoice.pokemonKey,
  );

  if (!myPokemonData || !receivedPokemonData) {
    return embed.setDescription(language("tradeCompletedDesc", lang));
  }

  const langKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as
    | "nameFr"
    | "nameEng";
  const myPokemonName = myPokemonData.name[langKey][0];
  const receivedPokemonName = receivedPokemonData.name[langKey][0];
  const myCount = user.savePokemon.data[myChoice.pokemonKey]?.normalCount || 0;
  const receivedCount =
    user.savePokemon.data[receivedChoice.pokemonKey]?.normalCount || 0;

  return embed
    .setDescription(language("tradeCompletedDesc", lang))
    .addFields(
      {
        name: language("tradeYouGive", lang),
        value: `${myPokemonName} (${myCount})`,
        inline: true,
      },
      {
        name: language("tradeYouReceive", lang),
        value: `${receivedPokemonName} (${receivedCount})`,
        inline: true,
      },
    );
}
