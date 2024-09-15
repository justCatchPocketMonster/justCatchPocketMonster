import SaveOnePokemon from './SaveOnePokemonType';

interface StatType {
    version: string;
    pokemonSpawned: number;
    pokemonCaught: number;
    save: SaveOnePokemon[];
}

export default StatType;