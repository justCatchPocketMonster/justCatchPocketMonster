import {EventSpawn} from './EventSpawn';
import {Pokemon} from './Pokemon';
import {ServerType} from '../types/ServerType';
import {defaultLanguage} from "../../config/default/server";
import {SaveAllPokemon} from './SaveAllPokemon';

export class Server implements ServerType {
    constructor(
        public id: string,
        public channelAllowed: string[],
        public charmeChroma: boolean,
        public language: string,
        public savePokemon: SaveAllPokemon,
        public eventSpawn: EventSpawn,
        public maxCountMessage: number,
        public countMessage: number,
        public pokemonPresent: Record<string, Pokemon>
    ) {}

    getPokemonByIdChannel(idChannel: string): Pokemon | null {
        const key = idChannel;
        if (this.pokemonPresent[key]) {
            return this.pokemonPresent[key];
        }
        return null;
    }

    removePokemonByIdChannel(idChannel: string): void {
        const key = idChannel;
        if (this.pokemonPresent[key]) {
            delete this.pokemonPresent[key];
        }
    }

    static fromMongo(data: ServerType): Server {
        const savePokemon = SaveAllPokemon.fromMongo(data.savePokemon ?? {});


        const pokemonPresent: Record<string, Pokemon> = {};
        for (const [key, value] of Object.entries(data.pokemonPresent ?? {})) {
            pokemonPresent[key] = new Pokemon(
                value.id,
                value.name,
                value.arrayType,
                value.rarity,
                value.imgName,
                value.gen,
                value.form,
                value.versionForm,
                value.isShiny,
                value.hint
            );
        }

        const e = data.eventSpawn;
        const eventSpawn = new EventSpawn(
            e.gen,
            e.type,
            e.rarity,
            e.shiny,
            e.whatEvent ?? null,
            e.allowedForm,
            e.messageSpawn,
            e.nightMode,
            e.valeurMaxChoiceEgg
        );

        return new Server(
            data.id,
            data.channelAllowed,
            data.charmeChroma,
            data.language,
            savePokemon,
            eventSpawn,
            data.maxCountMessage,
            data.countMessage,
            pokemonPresent
        );
    }

    static createDefault(id: string): Server {
        return new Server(
            id,
            [], // channelAllowed
            false,
            defaultLanguage,
            (new SaveAllPokemon()).updateMissSavePokemon(), // savePokemon
            EventSpawn.createDefault(),
            10,
            0,
            {} // pokemonPresent
        );
    }



}
