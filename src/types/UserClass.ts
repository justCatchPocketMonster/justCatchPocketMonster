import SaveOnePokemon from './SaveOnePokemonType';

class UserType {
    id: string;
    enteredCode: string[];
    savePokemon: SaveOnePokemon[];
    countPagination: number;

    constructor(id: string, enteredCode: string[] = [], savePokemon: SaveOnePokemon[] = [], countPagination: number = 0) {
        this.id = id;
        this.enteredCode = enteredCode;
        this.savePokemon = savePokemon;
        this.countPagination = countPagination;
    }
}

export default UserType;