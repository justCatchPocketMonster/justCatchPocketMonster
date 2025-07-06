import {SaveOnePokemon} from "../classes/SaveOnePokemon";


export interface SaveAllPokemonType {
    data: Record<string, SaveOnePokemon>;
    getCatchByOnlyId(id: String): number
}