import SaveOnePokemon from './SaveOnePokemonType';

interface UserType {
    id: string;
    enteredCode: string[];
    savePokemon: SaveOnePokemon[];
    countPagination: number;
}

export default UserType;