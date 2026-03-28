import { SaveAllPokemonType } from "./SaveAllPokemonType";

export interface UserType {
  discordId: string;
  enteredCode: string[];
  savePokemon: SaveAllPokemonType;
  countPagination: number;
}
