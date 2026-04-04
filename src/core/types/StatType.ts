import { SaveAllPokemonType } from "./SaveAllPokemonType";

export interface StatType {
  version: string;
  pokemonSpawned: number;
  pokemonSpawnedShiny: number;
  pokemonCaught: number;
  pokemonCaughtShiny: number;
  savePokemonSpawn: SaveAllPokemonType;
  savePokemonCatch: SaveAllPokemonType;
  bestSosChain: number;
  raidsAppeared: number;
  raidsWon: number;
  raidsLost: number;
}
