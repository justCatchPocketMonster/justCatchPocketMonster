import { SaveOnePokemon } from './SaveOnePokemon';
import {UserType} from '../types/UserType';
import {ServerType} from "../types/ServerType";
import {Pokemon} from "./Pokemon";
import {EventSpawn} from "./EventSpawn";
import allPokemon from "../../data/pokemon.json";
import {defaultLanguage} from "../../config/default/server";

export class User implements UserType {
    constructor(
        public id: string,
        public enteredCode: string[],
        public savePokemon: Record<string, SaveOnePokemon>,
        public countPagination: number
    ) {}

    static fromMongo(data: UserType): User {
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

        return new User(
            data.id,
            data.enteredCode,
            savePokemon,
            data.countPagination
        );
    }

    static createDefault(id: string): User {
        const defaultUser = new User(
            id,
            [], // enteredCode
            {}, // savePokemon
            0
        );
        defaultUser.updateMissSavePokemon();
        return defaultUser;
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
