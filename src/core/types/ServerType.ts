
import {EventSpawnType} from './EventSpawnType';
import {PokemonType} from './PokemonType';
import {SaveOnePokemonType} from "./SaveOnePokemonType";

export interface ServerType {
    id: string;
    channelAllowed: string[];
    charmeChroma: boolean;
    language: string;
    savePokemon: Record<string, SaveOnePokemonType>;
    eventSpawn: EventSpawnType;

    maxCountMessage: number;
    countMessage: number;
    pokemonPresent: Record<string, PokemonType>;

}