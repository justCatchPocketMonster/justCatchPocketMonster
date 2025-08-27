import { Pokemon } from "../../core/classes/Pokemon";
import { PokemonType } from "../../core/types/PokemonType";
import { ServerType } from "../../core/types/ServerType";
import allPokemon from "../../data/pokemon.json";
import {
  hidePokemon,
  nbGeneration,
  valuePerRarity,
  valuePerType,
} from "../../config/default/spawn";
import { pokemonDb } from "../../core/types/pokemonDb";
import { initHint } from "../hint/initHint";
import { capitalizeFirstLetter } from "../../utils/helperFunction";
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
    pokemonChoiced = selectPokemonWithId(idPokemon);
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
    const randomIdPokemon = Math.floor(
      Math.random() * allPokemon[allPokemon.length].id,
    );
    pokemonChoiced = selectPokemonWithId(randomIdPokemon);
  } else {
    pokemonChoiced = selectPokemonWithId(idPokemon);
  }
  pokemonChoiced.isShiny = shinySelect(pokemonChoiced.id, server, true);
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

  let nbRandomShiny: number = Math.floor(Math.random() * tauxShiny);
  return nbRandomShiny === 1;
}

function isHiddenPokemon(
  server: ServerType,
  pokemon: PokemonType,
): PokemonType {
  let randomNumber: number = Math.floor(Math.random() * hidePokemon.maxValue);

  if (randomNumber == 1) {
    const allPokemonWithId = allPokemon.filter((pokemon) =>
      hidePokemon.idPokemon.includes(pokemon.id),
    );
    const choicePokemon =
      allPokemonWithId[Math.floor(Math.random() * allPokemonWithId.length)];

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

function selectPokemonWithId(idPokemon: number): Pokemon {
  const allPokemonWithId = allPokemon.filter(
    (pokemon) => pokemon.id === idPokemon,
  );
  const randomPokemon =
    allPokemonWithId[Math.floor(Math.random() * allPokemonWithId.length)];

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
  const randomPokemon =
    pokemonPassType[Math.floor(Math.random() * pokemonPassType.length)];
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
      randomPokemon.name["name" + capitalizeFirstLetter(server.language)][0],
    ),
  };
}

function generationSelect(server: ServerType): string {
  const randomNumber = Math.floor(Math.random() * (nbGeneration * 100));
  let somStatByGen = 0;

  for (let gen = 1; gen <= 9; gen++) {
    // @ts-ignore
    somStatByGen += server.eventSpawn.gen[gen];
    if (randomNumber <= somStatByGen) {
      return gen.toString();
    }
  }
  return "errorGen";
}

function raritySelect(server: ServerType): string {
  const randomNumber = Math.floor(Math.random() * 1000);
  let somStatByRarity = 0;
  let arrayRarity: string[] = Object.keys(valuePerRarity);
  for (const element of arrayRarity) {
    // @ts-ignore
    somStatByRarity += server.eventSpawn.rarity[element];
    if (randomNumber <= somStatByRarity) {
      return element;
    }
  }

  return "errorRarity";
}

function typeSelect(server: ServerType): string {
  const randomNumber = Math.floor(
    Math.random() * Object.values(valuePerType).reduce((a, b) => a + b, 0),
  );
  let somStatByType = 0;
  let arrayType: string[] = Object.keys(valuePerType);

  for (const element of arrayType) {
    // @ts-ignore
    somStatByType += server.eventSpawn.type[element];
    if (randomNumber <= somStatByType) {
      return element;
    }
  }

  return "errorType";
}
