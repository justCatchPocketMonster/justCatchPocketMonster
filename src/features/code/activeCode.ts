import {UserType} from "../../core/types/UserType";
import {selectPokemon} from "../pokemon/selectPokemon";
import {Pokemon} from "../../core/classes/Pokemon";
import {Server} from "../../core/classes/Server";

const activeCode = (typeCode: string, user: UserType): boolean => {
  switch (typeCode) {
    case "shiny":
      console.log("shiny");
      return true;
      // TODO: when function is implemented
      break;
    default:
      throw new Error("Code not found :" + typeCode);
  }
};

export default activeCode;

const activeCodeShiny = (user: UserType): boolean => {
  const pokemonChoiced = selectPokemon(Server.createDefault("id"))
  pokemonChoiced.isShiny = true;
}