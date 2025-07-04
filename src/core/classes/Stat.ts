import { SaveOnePokemon } from './SaveOnePokemon';
import {StatType} from '../types/StatType';
import {UserType} from "../types/UserType";
import allPokemon from "../../data/pokemon.json";
import {defaultLanguage} from "../../config/default/server";
import {EventSpawn} from "./EventSpawn";

export class Stat implements StatType {
    constructor(
        public version: string,
        public pokemonSpawned: number,
        public pokemonCaught: number,
        public savePokemon: Record<string, SaveOnePokemon>
    ) {}

    static fromMongo(data: StatType): Stat {
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

        return new Stat(
            data.version,
            data.pokemonSpawned,
            data.pokemonCaught,
            savePokemon
        );
    }

    static createDefault(id: string): Stat {
        const defaultStat = new Stat(
            id,
            0, // pokemonSpawned
            0, // pokemonCaught
            {} // savePokemon
        );
        defaultStat.updateMissSavePokemon();
        return defaultStat;
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
