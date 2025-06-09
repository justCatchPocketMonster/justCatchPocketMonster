import SaveOnePokemon from './SaveOnePokemonType';

class StatType {
    version: string;
    pokemonSpawned: number;
    pokemonCaught: number;
    savePokemon: SaveOnePokemon[];

    constructor(version: string, pokemonSpawned: number = 0, pokemonCaught: number = 0, savePokemon: SaveOnePokemon[] = []) {
        this.version = version;
        this.pokemonSpawned = pokemonSpawned;
        this.pokemonCaught = pokemonCaught;
        this.savePokemon = savePokemon;
    }
}

export default StatType;