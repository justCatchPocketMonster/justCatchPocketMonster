import { EmbedBuilder } from "discord.js";
import language from "../../lang/language";
import { UserType } from "../../core/types/UserType";
import { ServerType } from "../../core/types/ServerType";
import { SaveOnePokemon } from "../../core/classes/SaveOnePokemon";
import allPokemon from "../../data/pokemon.json";
import { pokemonDb } from "../../core/types/pokemonDb";
import { getTradeCooldown, TradeData } from "./tradeCache";
import { formatTimestamp } from "../../utils/helperFunction";

const RARITY_COOLDOWNS: Record<string, number> = {
  legendary: 86400000,
  fabulous: 604800000,
  ultraBeast: 86400000,
};

export function calculateCooldownRemaining(
  userId: string,
  rarity: string,
): number | null {
  const cooldown = getTradeCooldown(userId, rarity);
  if (!cooldown || cooldown.expiresAt <= Date.now()) {
    return null;
  }
  return cooldown.expiresAt - Date.now();
}

export function isPokemonEligible(
  pokemon: SaveOnePokemon,
  requiredRarity?: string,
): boolean {
  const totalCount = pokemon.normalCount + pokemon.shinyCount;
  if (totalCount < 2) return false;
  if (requiredRarity && pokemon.rarity !== requiredRarity) return false;
  return true;
}

export function getEligiblePokemon(
  user: UserType,
  requiredRarity?: string,
): Array<{ key: string; pokemon: SaveOnePokemon; data: pokemonDb }> {
  const eligible: Array<{
    key: string;
    pokemon: SaveOnePokemon;
    data: pokemonDb;
  }> = [];

  for (const [key, pokemon] of Object.entries(user.savePokemon.data)) {
    if (isPokemonEligible(pokemon, requiredRarity)) {
      const pokemonData = allPokemon.find(
        (p) =>
          p.id.toString() === pokemon.idPokemon &&
          p.form === pokemon.form &&
          p.versionForm === pokemon.versionForm,
      );
      if (pokemonData) {
        eligible.push({ key, pokemon, data: pokemonData });
      }
    }
  }

  return eligible;
}

function getCooldownFields(userId: string, lang: string): string[] {
  const rarities = ["legendary", "fabulous", "ultraBeast"];
  const rarityNames: Record<string, string> = {
    legendary: language("statCategoryLegendary", lang),
    fabulous: language("statCategoryFabulous", lang),
    ultraBeast: language("statCategoryUltraBeast", lang),
  };

  return rarities
    .map((rarity) => {
      const remaining = calculateCooldownRemaining(userId, rarity);
      if (remaining === null) return null;
      return `${rarityNames[rarity]}: ${formatTimestamp(Date.now() + remaining)}`;
    })
    .filter((field): field is string => field !== null);
}

export function createEmbedAsk(
  tradeData: TradeData,
  server: ServerType,
  isInitiator: boolean,
  initiatorName: string,
  targetName: string,
): EmbedBuilder {
  const lang = server.settings.language;
  const embed = new EmbedBuilder();

  if (isInitiator) {
    embed.setTitle(language("tradeRequestSent", lang));
    embed.setDescription(
      language("tradeRequestSentDesc", lang).replace("{user}", targetName),
    );
  } else {
    embed.setTitle(language("tradeRequestReceived", lang));
    embed.setDescription(
      language("tradeRequestReceivedDesc", lang).replace(
        "{user}",
        initiatorName,
      ),
    );
  }

  const userId = isInitiator ? tradeData.initiatorId : tradeData.targetId;
  const cooldownFields = getCooldownFields(userId, lang);

  embed.addFields({
    name: language("tradeRulesTitle", lang),
    value: language("tradeRules", lang),
  });

  if (cooldownFields.length > 0) {
    embed.addFields({
      name: language("tradeCooldownsTitle", lang),
      value: cooldownFields.join("\n"),
    });
  }

  embed.addFields({
    name: language("tradeTimeout", lang).replace(
      "{time}",
      formatTimestamp(tradeData.expiresAt),
    ),
    value: cooldownFields.join("\n"),
  });

  embed.setColor(0x3498db);
  return embed;
}

function getPokemonName(
  pokemonData: pokemonDb | undefined,
  choice: { pokemonId: string },
  lang: string,
): string {
  if (!pokemonData) return choice.pokemonId;
  const langKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as
    | "nameFr"
    | "nameEng";
  return pokemonData.name[langKey][0];
}

export function createTradeSummaryEmbed(
  tradeData: TradeData,
  server: ServerType,
  isInitiator: boolean,
  initiatorName: string,
  targetName: string,
): EmbedBuilder {
  const lang = server.settings.language;
  const embed = new EmbedBuilder().setTitle(
    language("tradeSummaryTitle", lang),
  );

  const myChoice = isInitiator
    ? tradeData.initiatorChoice
    : tradeData.targetChoice;
  const theirChoice = isInitiator
    ? tradeData.targetChoice
    : tradeData.initiatorChoice;

  if (myChoice && theirChoice) {
    const myPokemonData = allPokemon.find(
      (p) =>
        p.id.toString() === myChoice.pokemonId &&
        `${p.id}-${p.form}-${p.versionForm}` === myChoice.pokemonKey,
    );
    const theirPokemonData = allPokemon.find(
      (p) =>
        p.id.toString() === theirChoice.pokemonId &&
        `${p.id}-${p.form}-${p.versionForm}` === theirChoice.pokemonKey,
    );

    const myPokemonName = getPokemonName(myPokemonData, myChoice, lang);
    const theirPokemonName = getPokemonName(
      theirPokemonData,
      theirChoice,
      lang,
    );
    const myName = isInitiator ? initiatorName : targetName;
    const theirName = isInitiator ? targetName : initiatorName;

    embed.setDescription(
      language("tradeSummaryDesc", lang)
        .replace("{myName}", myName)
        .replace("{theirName}", theirName)
        .replace("{myPokemon}", myPokemonName)
        .replace("{theirPokemon}", theirPokemonName),
    );

    embed.addFields(
      {
        name: language("tradeYouGive", lang),
        value: myPokemonName,
        inline: true,
      },
      {
        name: language("tradeYouReceive", lang),
        value: theirPokemonName,
        inline: true,
      },
    );
  } else {
    embed.setDescription(language("tradeWaitingOther", lang));
  }

  embed.setColor(0x2ecc71);
  return embed;
}

export function getRarityCooldownMs(rarity: string): number {
  return RARITY_COOLDOWNS[rarity] || 0;
}
