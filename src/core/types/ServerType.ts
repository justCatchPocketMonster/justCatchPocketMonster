
import {EventSpawnType} from './EventSpawnType';
import {PokemonType} from './PokemonType';
import {SaveAllPokemonType} from "./SaveAllPokemonType";

export interface ServerType {
    id: string;
    channelAllowed: string[];
    charmeChroma: boolean;
    language: string;
    savePokemon: SaveAllPokemonType;
    eventSpawn: EventSpawnType;

    maxCountMessage: number;
    countMessage: number;
    pokemonPresent: Record<string, PokemonType>;

}