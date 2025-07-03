import { SaveOnePokemon } from './SaveOnePokemon';
import {StatType} from '../types/StatType';
import {UserType} from "../types/UserType";

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
                value.id,
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

}
