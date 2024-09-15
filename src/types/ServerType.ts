import SaveOnePokemonType from './SaveOnePokemonType';
import EventSpawnType from './EventSpawnType';
import PokemonType from './PokemonType';

interface ServerType {
    id: string;
    channelAllowed: string[];
    charmeChroma: boolean;
    language: string;
    save: SaveOnePokemonType[];
    eventSpawn: EventSpawnType;
    maxMessage: number;
    minMessage: number;

    maxCountMessage: number;
    countMessage: number;
    pokemonPresent: PokemonType[];

}

export default ServerType;
