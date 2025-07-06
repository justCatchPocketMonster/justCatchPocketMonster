import {SaveAllPokemonType} from "./SaveAllPokemonType";

export interface StatType {
    version: string;
    pokemonSpawned: number;
    pokemonCaught: number;
    savePokemon: SaveAllPokemonType;

}
