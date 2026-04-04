import { Pokemon } from "../../core/classes/Pokemon";
import { PokemonType } from "../../core/types/PokemonType";
import { ServerType } from "../../core/types/ServerType";
import { GenStat, RarityStat, TypeStat } from "../../core/types/EventSpawnType";
import allPokemon from "../../data/json/pokemon.json";
import {
  hidePokemon,
  nbGeneration,
  valuePerRarity,
  valuePerType,
} from "../../config/default/spawn";
import { pokemonDb } from "../../core/types/pokemonDb";
import { initHint } from "../hint/initHint";
import { capitalizeFirstLetter, random } from "../../utils/helperFunction";
export const __deps = {
  generationSelect,
  raritySelect,
  typeSelect,
};

export const selectPokemon = (
  server: ServerType,
  idPokemon: number = 0,
): PokemonType => {
  let pokemonChoiced: PokemonType;
  const pokemons: pokemonDb[] = allPokemon.map((p) => ({
    ...p,
    id: p.id,
    isShiny: false,
    hint: "",
  }));
  const isOnlyGigaOrNone = gigaIsAllowed(server, pokemons);
  const isMegaFilter: pokemonDb[] = megaIsAllowed(server, isOnlyGigaOrNone);
  if (idPokemon === 0) {
    pokemonChoiced = selectRandomPokemon(server, isMegaFilter);
    pokemonChoiced = isHiddenPokemon(server, pokemonChoiced);
  } else {
    pokemonChoiced = selectPokemonWithId(idPokemon, random(2) === 1);
  }

  pokemonChoiced.isShiny = shinySelect(pokemonChoiced.id, server, false);
  return pokemonChoiced;
};

export const selectEggPokemon = (
  server: ServerType,
  idPokemon: number = 0,
): PokemonType => {
  let pokemonChoiced: PokemonType;
  if (idPokemon === 0) {
    const randomIdPokemon = random(allPokemon.at(-1)!.id);
    pokemonChoiced = selectPokemonWithId(randomIdPokemon, false);
  } else {
    pokemonChoiced = selectPokemonWithId(idPokemon, false);
  }
  pokemonChoiced.isShiny = shinySelect(pokemonChoiced.id, server, true);
  pokemonChoiced.canSosBattle = false;
  const eggObject = allPokemon[0];

  pokemonChoiced.name = eggObject.name;
  pokemonChoiced.imgName = eggObject.imgName;
  return pokemonChoiced;
};

function shinySelect(
  idPokemon: string,
  server: ServerType,
  isEgg: boolean,
): boolean {
  let tauxShiny = 4096;
  let saveServer = server.savePokemon.getCatchByOnlyId(idPokemon);

  saveServer ??= 0;

  if (isEgg) {
    tauxShiny /= 2;
  }

  if (saveServer >= 100) {
    tauxShiny /= 2;
  } else if (saveServer >= 75) {
    tauxShiny /= 1.8;
  } else if (saveServer >= 50) {
    tauxShiny /= 1.6;
  } else if (saveServer >= 30) {
    tauxShiny /= 1.4;
  } else if (saveServer >= 20) {
    tauxShiny /= 1.3;
  } else if (saveServer >= 10) {
    tauxShiny /= 1.2;
  } else if (saveServer >= 5) {
    tauxShiny /= 1.15;
  } else if (saveServer >= 3) {
    tauxShiny /= 1.1;
  }

  if (server.charmeChroma) {
    tauxShiny /= 10;
  }

  let nbRandomShiny: number = random(tauxShiny);
  return nbRandomShiny === 1;
}

function isHiddenPokemon(
  server: ServerType,
  pokemon: PokemonType,
): PokemonType {
  let randomNumber: number = random(hidePokemon.maxValue);

  if (randomNumber === 1) {
    const allPokemonWithId = allPokemon.filter((pokemon) =>
      hidePokemon.idPokemon.includes(pokemon.id),
    );
    const choicePokemon = allPokemonWithId[random(allPokemonWithId.length)];

    pokemon.id = choicePokemon.id.toString();
    pokemon.arrayType.push(...choicePokemon.arrayType);
  }

  return pokemon;
}

function megaIsAllowed(
  server: ServerType,
  allowedPokemon: pokemonDb[],
): pokemonDb[] {
  if (server.eventSpawn.allowedForm.mega) {
    return allowedPokemon;
  } else {
    return allowedPokemon.filter((pokemon) => pokemon.form !== "mega");
  }
}
function gigaIsAllowed(
  server: ServerType,
  allowedPokemon: pokemonDb[],
): pokemonDb[] {
  if (server.eventSpawn.allowedForm.giga) {
    return allowedPokemon;
  } else {
    return allowedPokemon.filter((pokemon) => pokemon.form !== "giga");
  }
}

export function selectSosPokemon(
  server: ServerType,
  idPokemon: string,
  sosChainLvl: number,
): PokemonType {
  let sameSpecies = allPokemon.filter(
    (p) => p.id.toString() === idPokemon,
  ) as pokemonDb[];
  sameSpecies = gigaIsAllowed(server, sameSpecies);
  sameSpecies = megaIsAllowed(server, sameSpecies);
  if (sameSpecies.length === 0) {
    throw new Error(`No allowed form for SOS pokemon id ${idPokemon}`);
  }
  const randomPokemon = sameSpecies[random(sameSpecies.length)];
  const shinyRate = server.eventSpawn.shiny / Math.pow(2, sosChainLvl);
  const isShiny = random(Math.max(1, Math.floor(shinyRate))) === 1;
  const hint = initHint(
    randomPokemon.name[
      "name" + capitalizeFirstLetter(server.settings.language)
    ][0],
  );
  return {
    id: randomPokemon.id.toString(),
    name: {
      nameEng: randomPokemon.name["nameEng"],
      nameFr: randomPokemon.name["nameFr"],
    },
    arrayType: randomPokemon.arrayType,
    rarity: randomPokemon.rarity,
    imgName: randomPokemon.imgName,
    gen: randomPokemon.gen,
    form: randomPokemon.form,
    versionForm: randomPokemon.versionForm,
    isShiny,
    hint,
    canSosBattle: true,
    sosChainLvl,
  };
}

function selectPokemonWithId(
  idPokemon: number,
  canSosBattle: boolean = false,
): Pokemon {
  const allPokemonWithId = allPokemon.filter(
    (pokemon) => pokemon.id === idPokemon,
  );
  const randomPokemon = allPokemonWithId[random(allPokemonWithId.length)];

  return new Pokemon(
    randomPokemon.id.toString(),
    randomPokemon.name,
    randomPokemon.arrayType,
    randomPokemon.rarity,
    randomPokemon.imgName,
    randomPokemon.gen,
    randomPokemon.form,
    randomPokemon.versionForm,
    false,
    "",
    canSosBattle,
  );
}
function selectRandomPokemon(
  server: ServerType,
  allowedPokemon: pokemonDb[],
): PokemonType {
  let pokemonPassGen: pokemonDb[];
  let generation: string;
  do {
    generation = __deps.generationSelect(server);
    pokemonPassGen = allowedPokemon.filter(
      (pokemon) => pokemon.gen === Number(generation),
    );
  } while (pokemonPassGen[0] === undefined);
  let pokemonPassRarity: pokemonDb[];
  let rarity: string;
  do {
    rarity = __deps.raritySelect(server);
    pokemonPassRarity = pokemonPassGen.filter(
      (pokemon) => pokemon.rarity === rarity,
    );
  } while (pokemonPassRarity[0] === undefined);
  let pokemonPassType: pokemonDb[];
  let type: string;
  do {
    type = __deps.typeSelect(server);
    pokemonPassType = pokemonPassRarity.filter((pokemon) =>
      pokemon.arrayType.includes(type),
    );
  } while (pokemonPassType[0] === undefined);
  const randomPokemon = pokemonPassType[random(pokemonPassType.length)];
  return {
    id: randomPokemon.id.toString(),
    name: {
      nameEng: randomPokemon.name["nameEng"],
      nameFr: randomPokemon.name["nameFr"],
    },
    arrayType: randomPokemon.arrayType,
    rarity: randomPokemon.rarity,
    imgName: randomPokemon.imgName,
    gen: randomPokemon.gen,
    form: randomPokemon.form,
    versionForm: randomPokemon.versionForm,
    isShiny: false,
    hint: initHint(
      randomPokemon.name[
        "name" + capitalizeFirstLetter(server.settings.language)
      ][0],
    ),
    canSosBattle: random(2) === 1,
  };
}

function generationSelect(server: ServerType): string {
  const genKeys = Object.keys(server.eventSpawn.gen) as (keyof GenStat)[];
  const total = genKeys.reduce(
    (sum, key) => sum + server.eventSpawn.gen[key],
    0,
  );
  const randomNumber = random(total);
  let somStatByGen = 0;

  for (const key of genKeys) {
    somStatByGen += server.eventSpawn.gen[key];
    if (randomNumber < somStatByGen) {
      return key;
    }
  }
  return "errorGen";
}

function raritySelect(server: ServerType): string {
  const arrayRarity = Object.keys(valuePerRarity) as (keyof RarityStat)[];
  const total = arrayRarity.reduce(
    (sum, key) => sum + server.eventSpawn.rarity[key],
    0,
  );
  const randomNumber = random(total);
  let somStatByRarity = 0;
  for (const element of arrayRarity) {
    somStatByRarity += server.eventSpawn.rarity[element];
    if (randomNumber < somStatByRarity) {
      return element;
    }
  }

  return "errorRarity";
}

function typeSelect(server: ServerType): string {
  const arrayType = Object.keys(server.eventSpawn.type) as (keyof TypeStat)[];
  const total = arrayType.reduce(
    (sum, key) => sum + server.eventSpawn.type[key],
    0,
  );
  const randomNumber = random(total);
  let somStatByType = 0;

  for (const element of arrayType) {
    somStatByType += server.eventSpawn.type[element];
    if (randomNumber < somStatByType) {
      return element;
    }
  }

  return "errorType";
}
