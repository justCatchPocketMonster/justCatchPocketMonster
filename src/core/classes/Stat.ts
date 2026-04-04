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
    public bestSosChain: number = 0,
    public raidsAppeared: number = 0,
    public raidsWon: number = 0,
    public raidsLost: number = 0,
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
      data.bestSosChain ?? 0,
      data.raidsAppeared ?? 0,
      data.raidsWon ?? 0,
      data.raidsLost ?? 0,
    );
  }

  updateBestSosChain(chainLvl: number): void {
    if (chainLvl > this.bestSosChain) this.bestSosChain = chainLvl;
  }

  addRaidAppeared(): void { this.raidsAppeared++; }
  addRaidWon(): void      { this.raidsWon++; }
  addRaidLost(): void     { this.raidsLost++; }

  addCatch(pokemon: Pokemon): void {
    this.pokemonCaught++;
    if (pokemon.isShiny) {
      this.pokemonCaughtShiny++;
    }
    this.savePokemonCatch.addOneCatch(pokemon);
  }

  addSpawn(pokemon: Pokemon): void {
    this.pokemonSpawned++;
    if (pokemon.isShiny) {
      this.pokemonSpawnedShiny++;
    }
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
