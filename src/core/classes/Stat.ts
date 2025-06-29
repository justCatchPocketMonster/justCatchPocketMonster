import { SaveOnePokemon } from './SaveOnePokemon';
import {StatType} from '../types/StatType';

export class Stat implements StatType {
    constructor(
        public version: string,
        public pokemonSpawned: number,
        public pokemonCaught: number,
        public savePokemon: Record<string, SaveOnePokemon>
    ) {}
}
