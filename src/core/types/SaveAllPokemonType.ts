import { SaveOnePokemon } from "../classes/SaveOnePokemon";
import { PokemonType } from "./PokemonType";

export interface SaveAllPokemonType {
  data: Record<string, SaveOnePokemon>;
  getCatchByOnlyId(id: String): number;
  addOneCatch(pokemon: PokemonType): void;
  getSavesById(id: string): SaveOnePokemon[];
  getThisSaveUniqueId(): SaveAllPokemonType;
}
