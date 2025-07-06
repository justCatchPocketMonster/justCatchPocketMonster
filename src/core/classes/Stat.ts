import {StatType} from '../types/StatType';
import {SaveAllPokemon} from "./SaveAllPokemon";

export class Stat implements StatType {
    constructor(
        public version: string,
        public pokemonSpawned: number,
        public pokemonCaught: number,
        public savePokemon: SaveAllPokemon
    ) {}

    static fromMongo(data: StatType): Stat {
        const savePokemon = new SaveAllPokemon()

        return new Stat(
            data.version,
            data.pokemonSpawned,
            data.pokemonCaught,
            savePokemon
        );
    }

    static createDefault(id: string): Stat {
        return new Stat(
            id,
            0, // pokemonSpawned
            0, // pokemonCaught
            (new SaveAllPokemon()).updateMissSavePokemon()
        );
    }

}
