import SaveOnePokemon from './SaveOnePokemon';

interface UserType {
    id: string;
    enteredCode: string[];
    save: SaveOnePokemon[];
    countPagination: number;
}

export default UserType;