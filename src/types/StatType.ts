import SaveOnePokemon from './SaveOnePokemonType';

interface StatType {
    version: string;
    pokemonSpawned: number;
    pokemonCaught: number;
    savePokemon: SaveOnePokemon[];

}

export default StatType;