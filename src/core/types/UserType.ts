import { SaveAllPokemonType } from "./SaveAllPokemonType";

export interface UserType {
  id: string;
  enteredCode: string[];
  savePokemon: SaveAllPokemonType;
  countPagination: number;
}
