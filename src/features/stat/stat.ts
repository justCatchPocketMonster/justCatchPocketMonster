import {
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import { Stat } from "../../core/classes/Stat";
import { paginationMenu } from "../other/paginationMenu";
import { SortedResult } from "../../core/classes/SaveAllPokemon";
import allPokemon from "../../data/pokemon.json";
import { ServerType } from "../../core/types/ServerType";
import language from "../../lang/language";

export function createPaginationStat(
  interaction: ChatInputCommandInteraction,
  actualVersionStat: Stat,
  generalVersionStat: Stat,
  server: ServerType,
) {
  const ascColor = "32CD32" as ColorResolvable;
  const descColor = "B22222" as ColorResolvable;

  const getLang = (key: string) => language(key, server.language);

  const createSectionHeader = (title: string) => ({
    page: null,
    image: null,
    information: {
      nameSelection: `------${title}------`,
    },
  });

  const createEntry = (title: string, page: any) => ({
    page,
    image: null,
    information: {
      nameSelection: title,
    },
  });

  const createStatEntries = (
    rarityOrForm: string,
    labelKey: string,
    type: "rarity" | "form",
  ) => {
    const title = getLang(labelKey);

    const getCatches = (asc: boolean) => {
      return type === "rarity"
        ? actualVersionStat.getTopCatchedPokemonByRarity(
            rarityOrForm,
            false,
            asc,
          )
        : actualVersionStat.getTopCatchedPokemonByForm(
            rarityOrForm,
            false,
            asc,
          );
    };

    const getSpawns = (asc: boolean) => {
      return type === "rarity"
        ? actualVersionStat.getTopSpawnedPokemonByRarity(
            rarityOrForm,
            false,
            asc,
          )
        : actualVersionStat.getTopSpawnedPokemonByForm(
            rarityOrForm,
            false,
            asc,
          );
    };

    return [
      createEntry(
        "🔼 " + getLang("statTopCatches") + " " + title,
        embedClassement(
          getCatches(true),
          server,
          getLang("statTopCatches") + " " + title,
          ascColor,
        ),
      ),
      createEntry(
        "🔽 " + getLang("statTopCatches") + " " + title,
        embedClassement(
          getCatches(false),
          server,
          getLang("statTopCatches") + " " + title,
          descColor,
        ),
      ),
      createEntry(
        "🔼 " + getLang("statTopSpawns") + " " + title,
        embedClassement(
          getSpawns(true),
          server,
          getLang("statTopSpawns") + " " + title,
          ascColor,
        ),
      ),
      createEntry(
        "🔽 " + getLang("statTopSpawns") + " " + title,
        embedClassement(
          getSpawns(false),
          server,
          getLang("statTopSpawns") + " " + title,
          descColor,
        ),
      ),
    ];
  };

  const arrayEmbed = [
    createEntry(
      getLang("statMainPageName"),
      principalEmbedStat(actualVersionStat, generalVersionStat, server),
    ),

    createSectionHeader(getLang("statCategoryOrdinary")),
    ...createStatEntries("ordinary", "statCategoryOrdinary", "rarity"),

    createSectionHeader(getLang("statCategoryLegendary")),
    ...createStatEntries("legendary", "statCategoryLegendary", "rarity"),

    createSectionHeader(getLang("statCategoryMythical")),
    ...createStatEntries("mythical", "statCategoryMythical", "rarity"),

    createSectionHeader(getLang("statCategoryMega")),
    ...createStatEntries("mega", "statCategoryMega", "form"),
  ];

  paginationMenu(interaction, getLang("selectAPage"), arrayEmbed);
}

function embedClassement(
  arraySortPokemon: SortedResult[],
  server: ServerType,
  title: string,
  color: ColorResolvable,
) {
  const embed = new EmbedBuilder().setTitle(title).setColor(color);



  arraySortPokemon.slice(0, 21).forEach((statPokemon, index) => {
    const displayedPokemons = getPokemonNameByStatId(statPokemon, server);

    const remainingCount = statPokemon.who.length - 3;
    const suffix = remainingCount > 0 ? `(+ ${remainingCount} autres)` : "";

    embed.addFields({
      name: `${index + 1}. ${statPokemon.maxCount}`,
      value: displayedPokemons + (suffix ? ` ${suffix}` : ""),
      inline: true,
    });
  });
  return embed;
}

function getPokemonNameByStatId(statId: SortedResult, server:ServerType): string {
  const langKey = `name${server.language[0].toUpperCase() + server.language.slice(1)}` as "nameEng" | "nameFr";
  const names = statId.who
      .map((id) => {
        const pokemon = allPokemon.find((p) => p.id.toString() === id);
        return pokemon ? pokemon.name[langKey].join(" ") : null;
      })
      .filter(Boolean);

  const displayedNames = names.slice(0, 3);
  return names.length > 3
      ? `${displayedNames.join(", ")}...`
      : displayedNames.join(", ");
}


function principalEmbedStat(
  actualVersionStat: Stat,
  generalVersionStat: Stat,
  server: ServerType,
) {
  const t = (key: string) => language(key, server.language);

  const embed = new EmbedBuilder().setTitle("stats").setColor("Purple");

  const addStatFields = (
    fields: { name: string; value: string | number }[],
  ) => {
    for (let i = 0; i < fields.length; i += 2) {
      embed.addFields(
        { name: fields[i].name, value: String(fields[i].value), inline: true },
        {
          name: fields[i + 1].name,
          value: String(fields[i + 1].value),
          inline: true,
        },
      );
    }
  };

  addStatFields([
    {
      name: t("nombreDeCaptureTotaly"),
      value: generalVersionStat.pokemonSpawned,
    },
    {
      name: t("nombreDeCaptureShinyTotaly"),
      value: generalVersionStat.pokemonSpawnedShiny,
    },
    { name: t("nombreDeSpawnTotaly"), value: generalVersionStat.pokemonCaught },
    {
      name: t("nombreDeSpawnShinyTotaly"),
      value: generalVersionStat.pokemonCaughtShiny,
    },
  ]);

  addStatFields([
    {
      name: t("nombreDeCaptureVersion"),
      value: actualVersionStat.pokemonSpawned,
    },
    {
      name: t("nombreDeCaptureShinyVersion"),
      value: actualVersionStat.pokemonSpawnedShiny,
    },
    { name: t("nombreDeSpawnVersion"), value: actualVersionStat.pokemonCaught },
    {
      name: t("nombreDeSpawnShinyVersion"),
      value: actualVersionStat.pokemonCaughtShiny,
    },
  ]);

  const leastCaught = generalVersionStat.savePokemonCatch.sortPokemonsByCount({
    ascending: true,
    useShiny: false,
  })[0];
  const mostCaught = generalVersionStat.savePokemonCatch.sortPokemonsByCount({
    ascending: false,
    useShiny: false,
  })[0];
  addStatFields([
    {
      name: t("pokemonLeastCaught"),
      value: getPokemonNameByStatId(leastCaught, server),
    },
    { name: t("pokemonMostCaught"), value: getPokemonNameByStatId(mostCaught, server) },
  ]);

  const leastSpawned = generalVersionStat.savePokemonSpawn.sortPokemonsByCount({
    ascending: true,
    useShiny: false,
  })[0];
  const mostSpawned = generalVersionStat.savePokemonSpawn.sortPokemonsByCount({
    ascending: false,
    useShiny: false,
  })[0];
  addStatFields([
    {
      name: t("pokemonLeastSpawn"),
      value: getPokemonNameByStatId(leastSpawned, server),
    },
    { name: t("pokemonMostSpawn"), value: getPokemonNameByStatId(mostSpawned, server) },
  ]);

  return embed;
}

interface pokemon {
  id: number;
  name: {
    [key: string]: string[];
  };
  arrayType: string[];
  rarity: string;
  gen: number;
  imgName: string;
  form: string;
  versionForm: number;
}
