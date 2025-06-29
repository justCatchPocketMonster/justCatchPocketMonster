import {SaveOnePokemonType} from './SaveOnePokemonType';

export interface StatType {
    version: string;
    pokemonSpawned: number;
    pokemonCaught: number;
    savePokemon: Record<string, SaveOnePokemonType>;

}
