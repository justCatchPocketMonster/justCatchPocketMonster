import { SaveOnePokemon } from './SaveOnePokemon';
import { EventSpawn } from './EventSpawn';
import { Pokemon } from './Pokemon';
import {ServerType} from '../types/ServerType';
import {defaultLanguage} from "../../config/default/server";
import allPokemon from '../../data/pokemon.json';

export class Server implements ServerType {
    constructor(
        public id: string,
        public channelAllowed: string[],
        public charmeChroma: boolean,
        public language: string,
        public savePokemon: Record<string, SaveOnePokemon>,
        public eventSpawn: EventSpawn,
        public maxCountMessage: number,
        public countMessage: number,
        public pokemonPresent: Record<string, Pokemon>
    ) {}

    static fromMongo(data: ServerType): Server {
        const savePokemon: Record<string, SaveOnePokemon> = {};
        for (const [key, value] of Object.entries(data.savePokemon ?? {})) {
            savePokemon[key] = new SaveOnePokemon(
                value.idPokemon,
                value.form,
                value.versionForm,
                value.shinyCount,
                value.catchCount
            );
        }

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
            e.endTime ? new Date(e.endTime) : null,
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
        const defaultServer = new Server(
            id,
            [], // channelAllowed
            false,
            defaultLanguage,
            {}, // savePokemon
            EventSpawn.createDefault(),
            10,
            0,
            {} // pokemonPresent
        );
        defaultServer.updateMissSavePokemon();
        return defaultServer;
    }

    updateMissSavePokemon(): void {
        allPokemon.forEach(pokemon => {
            if (!this.savePokemon[pokemon.id+"-"+pokemon.form+"-"+pokemon.versionForm] && pokemon.id !== 0) {
                this.savePokemon[pokemon.id+"-"+pokemon.form+"-"+pokemon.versionForm] = new SaveOnePokemon(
                    pokemon.id,
                    pokemon.form,
                    pokemon.versionForm,
                    0,
                    0
                );
            }
        })
    }

}
