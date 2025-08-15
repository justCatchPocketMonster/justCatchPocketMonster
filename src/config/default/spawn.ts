import {GenStat, RarityStat, TypeStat} from "../../core/types/EventSpawnType";

export const minimumCount = 4 + 1;
export const maximumCount = 20;

export const nbGeneration = 6;
export const valuePerGen: GenStat = {
  "1": 100,
  "2": 100,
  "3": 100,
  "4": 100,
  "5": 100,
  "6": 100,
  "7": 100,
  "8": 100,
  "9": 100,
};

export const nbType = 18;
export const valuePerType: TypeStat = {
  steel: 100,
  dragon: 100,
  electric: 100,
  fire: 100,
  bug: 100,
  grass: 100,
  psychic: 100,
  ground: 100,
  dark: 100,
  fighting: 100,
  water: 100,
  fairy: 100,
  ice: 100,
  normal: 100,
  poison: 100,
  rock: 100,
  ghost: 100,
  flying: 100,
};

export const valuePerRarity: RarityStat = {
  ordinary: 990,
  legendary: 9,
  mythical: 1,
};

export const rateMaxShiny = 4096;

export const valueMaxChoiceEgg = 300;

export const hidePokemon = {
  idPokemon: [132, 570, 571],
  maxValue: 100,
};

export const valueMaxChoiceEvent = 100;
