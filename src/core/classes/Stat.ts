import {StatType} from '../types/StatType';
import {SaveAllPokemon} from "./SaveAllPokemon";
import {Pokemon} from "./Pokemon";

export class Stat implements StatType {
    constructor(
        public version: string,
        public pokemonSpawned: number,
        public pokemonCaught: number,
        public savePokemonSpawn: SaveAllPokemon,
        public savePokemonCatch: SaveAllPokemon
    ) {}

    static fromMongo(data: StatType): Stat {
        const savePokemonSpawn = SaveAllPokemon.fromMongo(data.savePokemonSpawn);
        const savePokemonCatch = SaveAllPokemon.fromMongo(data.savePokemonCatch);

        return new Stat(
            data.version,
            data.pokemonSpawned,
            data.pokemonCaught,
            savePokemonSpawn,
            savePokemonCatch
        );
    }

    addCatch(pokemon: Pokemon): void {
        this.pokemonCaught++;
        this.savePokemonCatch.addOneCatch(pokemon);
    }

    addSpawn(pokemon: Pokemon): void {
        this.pokemonSpawned++;
        this.savePokemonSpawn.addOneCatch(pokemon);
    }

    static createDefault(id: string): Stat {
        return new Stat(
            id,
            0, // pokemonSpawned
            0, // pokemonCaught
            (new SaveAllPokemon()).updateMissSavePokemon(),
            (new SaveAllPokemon()).updateMissSavePokemon()
        );
    }

}
