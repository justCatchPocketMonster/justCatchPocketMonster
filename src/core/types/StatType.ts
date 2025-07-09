import {SaveAllPokemonType} from "./SaveAllPokemonType";

export interface StatType {
    version: string;
    pokemonSpawned: number;
    pokemonCaught: number;
    savePokemonSpawn: SaveAllPokemonType;
    savePokemonCatch: SaveAllPokemonType;

}
