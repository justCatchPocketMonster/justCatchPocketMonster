import {UserType} from '../types/UserType';
import {SaveAllPokemon} from "./SaveAllPokemon";

export class User implements UserType {
    constructor(
        public id: string,
        public enteredCode: string[],
        public savePokemon: SaveAllPokemon,
        public countPagination: number
    ) {}

    static fromMongo(data: UserType): User {
        const savePokemon = new SaveAllPokemon();

        return new User(
            data.id,
            data.enteredCode,
            savePokemon,
            data.countPagination
        );
    }

    static createDefault(id: string): User {
        return new User(
            id,
            [], // enteredCode
            (new SaveAllPokemon()).updateMissSavePokemon(),
            0
        );
    }

}
