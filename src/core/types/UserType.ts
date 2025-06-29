import {SaveOnePokemonType} from './SaveOnePokemonType';

export interface UserType {
    id: string;
    enteredCode: string[];
    savePokemon: Record<string, SaveOnePokemonType>;
    countPagination: number;
}
