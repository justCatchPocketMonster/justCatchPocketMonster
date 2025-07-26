import { StatType } from "../types/StatType";
import { SaveAllPokemon, SortedResult } from "./SaveAllPokemon";
import { Pokemon } from "./Pokemon";

export class Stat implements StatType {
  constructor(
    public version: string,
    public pokemonSpawned: number,
    public pokemonSpawnedShiny: number,
    public pokemonCaught: number,
    public pokemonCaughtShiny: number,
    public savePokemonSpawn: SaveAllPokemon,
    public savePokemonCatch: SaveAllPokemon,
  ) {}

  static fromMongo(data: StatType): Stat {
    const savePokemonSpawn = SaveAllPokemon.fromMongo(data.savePokemonSpawn);
    const savePokemonCatch = SaveAllPokemon.fromMongo(data.savePokemonCatch);

    return new Stat(
      data.version,
      data.pokemonSpawned,
      data.pokemonSpawnedShiny,
      data.pokemonCaught,
      data.pokemonCaughtShiny,
      savePokemonSpawn,
      savePokemonCatch,
    );
  }

  addCatch(pokemon: Pokemon): void {
    this.pokemonCaught++;
    this.savePokemonCatch.addOneCatch(pokemon);
  }

  addSpawn(pokemon: Pokemon): void {
    this.pokemonSpawned++;
    this.savePokemonSpawn.addOneCatch(pokemon);
  }

  getTopSpawnedPokemonByRarity(
    rarity: string,
    useShiny: boolean,
    ascending: boolean,
  ): SortedResult[] {
    return this.savePokemonSpawn.sortPokemonsByCount({
      rarity,
      useShiny,
      ascending,
    });
  }

  getTopSpawnedPokemonByForm(
    form: string,
    useShiny: boolean,
    ascending: boolean,
  ): SortedResult[] {
    return this.savePokemonSpawn.sortPokemonsByCount({
      form,
      useShiny,
      ascending,
    });
  }

  getTopCatchedPokemonByRarity(
    rarity: string,
    useShiny: boolean,
    ascending: boolean,
  ): SortedResult[] {
    return this.savePokemonCatch.sortPokemonsByCount({
      rarity,
      useShiny,
      ascending,
    });
  }

  getTopCatchedPokemonByForm(
    form: string,
    useShiny: boolean,
    ascending: boolean,
  ): SortedResult[] {
    return this.savePokemonCatch.sortPokemonsByCount({
      form,
      useShiny,
      ascending,
    });
  }

  static createDefault(id: string): Stat {
    const saveAllPokemonSpawn: SaveAllPokemon = new SaveAllPokemon();
    const saveAllPokemonCatch: SaveAllPokemon = new SaveAllPokemon();
    saveAllPokemonSpawn.initMissingPokemons();
    saveAllPokemonCatch.initMissingPokemons();
    return new Stat(
      id,
      0, // pokemonSpawned
      0, // pokemonSpawnedShiny
      0, // pokemonCaught
      0, // pokemonCaughtShiny
      saveAllPokemonSpawn,
      saveAllPokemonCatch,
    );
  }
}
