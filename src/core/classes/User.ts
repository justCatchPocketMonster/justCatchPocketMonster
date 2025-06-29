import { SaveOnePokemon } from './SaveOnePokemon';
import {UserType} from '../types/UserType';

export class User implements UserType {
    constructor(
        public id: string,
        public enteredCode: string[],
        public savePokemon: Record<string, SaveOnePokemon>,
        public countPagination: number
    ) {}
}
