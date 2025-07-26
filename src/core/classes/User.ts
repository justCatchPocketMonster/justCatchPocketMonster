import { UserType } from "../types/UserType";
import { SaveAllPokemon } from "./SaveAllPokemon";

export class User implements UserType {
  constructor(
    public discordId: string,
    public enteredCode: string[],
    public savePokemon: SaveAllPokemon,
    public countPagination: number,
  ) {}

  static fromMongo(data: UserType): User {
    const savePokemon = SaveAllPokemon.fromMongo(data.savePokemon ?? {});

    return new User(
      data.discordId,
      data.enteredCode,
      savePokemon,
      data.countPagination,
    );
  }

  static createDefault(id: string): User {
    const saveAllPokemon: SaveAllPokemon = new SaveAllPokemon();
    saveAllPokemon.initMissingPokemons();
    return new User(
      id,
      [], // enteredCode
      saveAllPokemon,
      0,
    );
  }
}
