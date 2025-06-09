import SaveOnePokemonType from './SaveOnePokemonType';
import EventSpawnType from './EventSpawnType';
import PokemonType from './PokemonType';
import eventSpawn from "../models/EventSpawn";

class ServerType {
    id: string;
    channelAllowed: string[];
    charmeChroma: boolean;
    language: string;
    savePokemon: SaveOnePokemonType[];
    eventSpawn: EventSpawnType;
    maxMessageForRandom: number;
    minMessageForRandom: number;

    maxCountMessage: number;
    countMessage: number;
    pokemonPresent: PokemonType[];


    constructor(id: string, channelAllowed: string[], charmeChroma: boolean, language: string, savePokemon: SaveOnePokemonType[], eventSpawn: EventSpawnType, maxMessageForRandom: number, minMessageForRandom: number, maxCountMessage: number, countMessage: number, pokemonPresent: PokemonType[]) {
        this.id = id;
        this.channelAllowed = channelAllowed;
        this.charmeChroma = charmeChroma;
        this.language = language;
        this.savePokemon = savePokemon;
        this.eventSpawn = eventSpawn;
        this.maxMessageForRandom = maxMessageForRandom;
        this.minMessageForRandom = minMessageForRandom;
        this.maxCountMessage = maxCountMessage;
        this.countMessage = countMessage;
        this.pokemonPresent = pokemonPresent;
    }
}

export default ServerType;
