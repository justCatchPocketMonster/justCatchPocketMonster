import { UserType } from "../../core/types/UserType";
import {
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { ServerType } from "../../core/types/ServerType";
import {
  createPageForMenu,
  PageData,
  paginationMenu,
} from "../other/paginationMenu";
import language, { LanguageKey } from "../../lang/language";
import allPokemon from "../../data/pokemon.json";
import { pokemonDb } from "../../core/types/pokemonDb";
import {
  capitalizeFirstLetter,
  getPercentage,
} from "../../utils/helperFunction";

interface OneFieldEmbed {
  name: string;
  value: string;
  inline: boolean;
}

export async function pokedex(
  interaction: ChatInputCommandInteraction,
  user: UserType,
  server: ServerType,
  pageChoice: number | null,
) {
  const maxPokemonParPage = 21;
  const arrayEmbed: PageData[] = [];
  const page = pageChoice ?? 1;
  const nbPageMax = 2 + Math.trunc(allPokemon.at(-1)!.id / 21);

  let pageSelectedDefault: number;
  if (page > nbPageMax) {
    interaction.reply(language("valeurTropHaute", server.settings.language));
    pageSelectedDefault = 1;
  } else {
    pageSelectedDefault = page;
  }

  const avatar =
    interaction.user.avatarURL() ??
    "https://cdn.discordapp.com/embed/avatars/0.png";
  const member = interaction.member as GuildMember;
  const memberDisplayName = member.nickname ?? member.displayName;
  const lang = server.settings.language;
  const pokedexColor = getPokedexColor(user);

  const mainPage = buildMainPokedexPage(
    interaction,
    user,
    server,
    memberDisplayName,
    avatar,
    pokedexColor,
  );
  const summaryLabel = lang === "fr" ? "Résumé Pokédex" : "Pokédex Summary";
  arrayEmbed.push(createPageForMenu(mainPage, null, summaryLabel));

  let nbPage = 2;
  for (let y = 0; y <= allPokemon.at(-1)!.id; y += maxPokemonParPage) {
    const start = 1 + maxPokemonParPage * (nbPage - 2);
    const end = maxPokemonParPage * (nbPage - 1);
    const { embed, firstLabel, lastLabel, dot } = buildPokemonPage(
      start,
      end,
      user,
      server,
      interaction,
      pokedexColor,
    );
    const pageLabel =
      firstLabel && lastLabel
        ? `${firstLabel} — ${lastLabel} ${dot}`
        : `Page ${nbPage}`;
    nbPage++;
    arrayEmbed.push(createPageForMenu(embed, null, pageLabel));
  }

  const defaultText =
    lang === "fr" ? "Choisir une page..." : "Select a page...";
  paginationMenu(interaction, defaultText, arrayEmbed, pageSelectedDefault);
}

function buildMainPokedexPage(
  interaction: ChatInputCommandInteraction,
  user: UserType,
  server: ServerType,
  memberDisplayName: string,
  avatar: string,
  pokedexColor: ColorResolvable,
): EmbedBuilder {
  const totalPokemon = allPokemon.at(-1)!["id"];
  return new EmbedBuilder()
    .setThumbnail(avatar)
    .setColor(pokedexColor)
    .setDescription("\u200B")
    .setTitle(
      language("pokedexOf", server.settings.language) + memberDisplayName,
    )
    .addFields(
      {
        name: language("nationalDex", server.settings.language),
        value:
          user.savePokemon.countUniquePokemonsCaught() +
          "/" +
          totalPokemon +
          " - " +
          getPercentage(
            user.savePokemon.countUniquePokemonsCaught(),
            totalPokemon,
          ) +
          "%",
        inline: true,
      },
      {
        name: language("shinyDex", server.settings.language),
        value:
          user.savePokemon.countUniquePokemonsShinyCaught() +
          "/" +
          totalPokemon +
          " - " +
          getPercentage(
            user.savePokemon.countUniquePokemonsShinyCaught(),
            totalPokemon,
          ) +
          "%",
        inline: true,
      },
      {
        name: language("nationalDexServer", server.settings.language),
        value:
          server.savePokemon.countUniquePokemonsCaught() +
          "/" +
          totalPokemon +
          " - " +
          getPercentage(
            server.savePokemon.countUniquePokemonsCaught(),
            totalPokemon,
          ) +
          "%",
        inline: true,
      },
      { name: "\u200B", value: "\u200B", inline: false },
    )
    .addFields(...generateFieldRegionStat(user, server))
    .addFields({ name: "\u200B", value: "\u200B", inline: false });
}

function selectPageDot(caughtOnPage: number, totalOnPage: number): string {
  if (caughtOnPage === 0) return "⚫";
  if (caughtOnPage === totalOnPage) return "🟢";
  if (caughtOnPage >= totalOnPage / 2) return "🟠";
  return "🔴";
}

function buildPokemonPage(
  start: number,
  end: number,
  user: UserType,
  server: ServerType,
  interaction: ChatInputCommandInteraction,
  color: ColorResolvable,
): { embed: EmbedBuilder; firstLabel: string; lastLabel: string; dot: string } {
  const pokeSave = buildPokedexEmbed(interaction, user, server, color);
  const listPokemon = [];
  let firstLabel = "";
  let lastLabel = "";
  let caughtOnPage = 0;
  let totalOnPage = 0;

  for (let i = start; i <= end; i++) {
    const pokemonData: pokemonDb | undefined = allPokemon.find(
      (pokemon) => pokemon.id === i,
    );
    if (!pokemonData) continue;

    totalOnPage++;
    const nameKey = ("name" +
      capitalizeFirstLetter(server.settings.language)) as "nameFr" | "nameEng";
    const pokeName = pokemonData.name[nameKey][0];
    const label = `${pokemonData.id} ${pokeName}`;
    if (firstLabel === "") firstLabel = label;
    lastLabel = label;

    const savePokemon = user.savePokemon.getSaveOnePokemonFusedForm(
      pokemonData.id.toString(),
    );
    if (savePokemon.normalCount > 0) caughtOnPage++;

    listPokemon.push(buildPokemonField(pokemonData, user, server, interaction));
  }

  pokeSave.addFields(listPokemon);
  const dot = selectPageDot(caughtOnPage, totalOnPage);
  return { embed: pokeSave, firstLabel, lastLabel, dot };
}

function buildPokemonField(
  pokemonData: pokemonDb,
  user: UserType,
  server: ServerType,
  interaction: ChatInputCommandInteraction,
) {
  const emotePokeballDark = "<:pokeballDark:981974919212572682>";
  const emotePokeballLight = "<:pokeballLight:981974905568522331>";
  const emotePokeballShiny = "<:pokeballShinyStar:1005992732541603960>";
  const emoteMegaDark = "<:MegaVide:1141440546032853062> ";
  const emoteMega = "<:MEGA:1139228792989155359>";
  const emoteMegaShiny = "<:shinyMega:1141440293409923123>";
  const savePokemon = user.savePokemon.getSaveOnePokemonFusedForm(
    pokemonData.id.toString(),
  );

  let emote = emotePokeballDark;
  let value = language("noCatch", server.settings.language);

  if (savePokemon.shinyCount > 0) {
    emote = emotePokeballShiny;
    value =
      language("catched", server.settings.language) + savePokemon.shinyCount;
  } else if (savePokemon.normalCount > 0) {
    emote = emotePokeballLight;
    value =
      language("catched", server.settings.language) + savePokemon.normalCount;
  }

  let field = {
    name: `${pokemonData.id} ${savePokemon.normalCount > 0 ? pokemonData.name["name" + capitalizeFirstLetter(server.settings.language)] : "?????"}  ${emote}`,

    value: value,
    inline: true,
  };
  /** TOTO: form after
  const saveMega = pokemonForm.getSaveByForm(interaction.member.id, "mega");
  if (saveMega.hasOwnProperty(index + "")) {
    const megaData = saveMega[index];
    if (megaData.normal === 0) {
      field.name += emoteMegaDark;
    } else if (megaData.shiny === 0) {
      field.name += emoteMega;
    } else {
      field.name += emoteMegaShiny;
    }

  }
 **/
  return field;
}

function buildPokedexEmbed(
  interaction: ChatInputCommandInteraction,
  user: UserType,
  server: ServerType,
  color: ColorResolvable,
) {
  const avatar =
    interaction.user.avatarURL() ??
    "https://cdn.discordapp.com/embed/avatars/0.png";

  return new EmbedBuilder()
    .setThumbnail(avatar)
    .setColor(color)
    .setDescription("\u200B")
    .setTitle(
      language("pokedexOf", server.settings.language) +
        interaction.user.username,
    )
    .addFields(
      {
        name: language("nationalDex", server.settings.language),
        value:
          user.savePokemon.countUniquePokemonsCaught() +
          "/" +
          allPokemon.at(-1)!["id"] +
          " - " +
          getPercentage(
            server.savePokemon.countUniquePokemonsCaught(),
            allPokemon.at(-1)!["id"],
          ) +
          "%",
        inline: true,
      },
      {
        name: language("shinyDex", server.settings.language),
        value:
          user.savePokemon.countUniquePokemonsShinyCaught() +
          "/" +
          allPokemon.at(-1)!["id"] +
          " - " +
          getPercentage(
            server.savePokemon.countUniquePokemonsShinyCaught(),
            allPokemon.at(-1)!["id"],
          ) +
          "%",
        inline: true,
      },
      { name: "\u200B", value: "\u200B", inline: false },
    );
}

export function getPokedexColor(user: UserType): ColorResolvable {
  const regions = [
    { min: 0, max: 151 },
    { min: 151, max: 251 },
    { min: 251, max: 386 },
    { min: 386, max: 493 },
    { min: 493, max: 649 },
    { min: 649, max: 721 },
  ];

  const totalRegions = regions.length;
  let completedRegions = 0;

  for (const { min, max } of regions) {
    const rangeSize = max - min;
    const save = user.savePokemon.getThisSaveUniqueIdWithByIdRange(
      min + 1,
      max,
    );
    const caught = save.countUniquePokemonsCaught();
    if (caught >= rangeSize) completedRegions++;
  }

  if (completedRegions === totalRegions) return "#FFD700";
  if (completedRegions >= totalRegions / 2) return "#C0C0C0";
  if (completedRegions >= 1) return "#CD7F32";
  return "#FF0000";
}

function generateFieldRegionStat(
  user: UserType,
  server: ServerType,
): OneFieldEmbed[] {
  const regions: { name: RegionName; min: number; max: number }[] = [
    { name: "Kanto", min: 0, max: 151 },
    { name: "Johto", min: 151, max: 251 },
    { name: "Hoenn", min: 251, max: 386 },
    { name: "Sinnoh", min: 386, max: 493 },
    { name: "Unys", min: 493, max: 649 },
    { name: "Kalos", min: 649, max: 721 },
  ];

  return regions.map(({ name, min, max }) =>
    processRegion(user, server, name, min, max),
  );
}

type RegionName = "Kanto" | "Johto" | "Hoenn" | "Sinnoh" | "Unys" | "Kalos";
function processRegion(
  user: UserType,
  server: ServerType,
  regionName: RegionName,
  valueMin: number,
  valueMax: number,
): OneFieldEmbed {
  const rangeSize = valueMax - valueMin;
  const save = user.savePokemon.getThisSaveUniqueIdWithByIdRange(
    valueMin + 1,
    valueMax,
  );

  const caught = save.countUniquePokemonsCaught();
  const shiny = save.countUniquePokemonsShinyCaught();

  let name: string;
  let value: string;

  if (caught === rangeSize) {
    const shinyPercentage = getPercentage(shiny, rangeSize) + "%";
    value = `${shiny}/ ${rangeSize} - ${shinyPercentage}`;

    if (shiny === rangeSize) {
      name = `<:pokeballShinyStar:1005992732541603960> ${language(("shinyDex" + regionName) as LanguageKey, server.settings.language)}`;
    } else {
      name = `<:pokeballLight:981974905568522331> ${language(("shinydexDe" + regionName) as LanguageKey, server.settings.language)}`;
    }
  } else {
    const caughtPercentage = getPercentage(caught, rangeSize) + "%";
    name = `<:pokeballDark:981974919212572682> ${language(("pokedexDe" + regionName) as LanguageKey, server.settings.language)}`;
    value = `${caught}/ ${rangeSize} - ${caughtPercentage}`;
  }

  return {
    name,
    value,
    inline: true,
  };
}
