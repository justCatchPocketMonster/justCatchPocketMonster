import { Pokemon } from "../../core/classes/Pokemon";
import { PokemonType } from "../../core/types/PokemonType";
import { ServerType } from "../../core/types/ServerType";
import allPokemon from "../../data/pokemon.json";
import {checkTimeForResetEventStat} from "../event/checkTimeForResetEventStat";
import {
  hidePokemon,
  nbGeneration,
  valuePerRarity,
  valuePerType,
} from "../../config/default/spawn";
import {pokemonDb} from "../../core/types/pokemonDb";

export const selectPokemon = (
  server: ServerType,
  idPokemon: number = 0,
  isEgg: boolean = false,
): PokemonType => {
  checkTimeForResetEventStat(server.discordId);
  let pokemonChoiced: PokemonType;
  const pokemons: pokemonDb[] = allPokemon.map((p) => ({
    ...p,
    id: p.id,
    isShiny: false,
    hint: "",
  }));

  const allowedPokemon: pokemonDb[] = megaIsAllowed(server, pokemons);
  if (idPokemon === 0) {
    pokemonChoiced = selectRandomPokemon(server, allowedPokemon);
    pokemonChoiced = isHiddenPokemon(server, pokemonChoiced);
  } else {
    pokemonChoiced = selectPokemonWithId(idPokemon);
  }

  pokemonChoiced.isShiny = shinySelect(pokemonChoiced.id, server, isEgg);
  return pokemonChoiced;
};


function shinySelect(
  idPokemon: String,
  server: ServerType,
  isEgg: boolean,
): boolean {
  let tauxShiny = 4096;
  let saveServer = server.savePokemon.getCatchByOnlyId(idPokemon);

  if (saveServer === undefined) {
    saveServer = 0;
  }

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

function isHiddenPokemon(server: ServerType, pokemon: PokemonType): PokemonType {
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

function selectPokemonWithId(idPokemon: number): Pokemon {
  const allPokemonWithId = allPokemon.filter(
    (pokemon) => pokemon.id === idPokemon,
  );
  return new Pokemon(
    allPokemonWithId[0].id.toString(),
    allPokemonWithId[0].name,
    allPokemonWithId[0].arrayType,
    allPokemonWithId[0].rarity,
    allPokemonWithId[0].imgName,
    allPokemonWithId[0].gen,
    allPokemonWithId[0].form,
    allPokemonWithId[0].versionForm,
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
    generation = generationSelect(server);
    pokemonPassGen = allowedPokemon.filter(
      (pokemon) => pokemon.gen === Number(generation),
    );
  } while (pokemonPassGen[0] === undefined);
  let pokemonPassRarity: pokemonDb[];
  let rarity: string;
  do {
    rarity = raritySelect(server);
    pokemonPassRarity = pokemonPassGen.filter(
      (pokemon) => pokemon.rarity === rarity,
    );
  } while (pokemonPassRarity[0] === undefined);
  let pokemonPassType: pokemonDb[];
  let type: string;
  do {
    type = typeSelect(server);
    pokemonPassType = pokemonPassGen.filter((pokemon) =>
      pokemon.arrayType.includes(type),
    );
  } while (pokemonPassType[0] === undefined);
  const randomPokemon = pokemonPassType[Math.floor(Math.random() * pokemonPassType.length)]
  return {
    id: randomPokemon.id.toString(),
    name: {
      nameEng: randomPokemon.name["nameEng"],
      nameFr:  randomPokemon.name["nameFr"],
    },
    arrayType: randomPokemon.arrayType,
    rarity: randomPokemon.rarity,
    imgName: randomPokemon.imgName,
    gen: randomPokemon.gen,
    form: randomPokemon.form,
    versionForm: randomPokemon.versionForm,
    isShiny: false,
    hint: "",
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
  for (let i = 0; i < arrayRarity.length; i++) {
    // @ts-ignore
    somStatByRarity += server.eventSpawn.rarity[arrayRarity[i]];
    if (randomNumber <= somStatByRarity) {
      return arrayRarity[i];
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

  for (let i = 0; i < arrayType.length; i++) {
    // @ts-ignore
    somStatByType += server.eventSpawn.type[arrayType[i]];
    if (randomNumber <= somStatByType) {
      return arrayType[i];
    }
  }

  return "errorType";
}
