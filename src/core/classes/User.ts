import { SaveOnePokemon } from './SaveOnePokemon';
import {UserType} from '../types/UserType';
import {ServerType} from "../types/ServerType";
import {Pokemon} from "./Pokemon";
import {EventSpawn} from "./EventSpawn";

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
                value.id,
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
}
