import { EventSpawnType } from "./EventSpawnType";
import { PokemonType } from "./PokemonType";
import { SaveAllPokemonType } from "./SaveAllPokemonType";
import { Pokemon } from "../classes/Pokemon";

export interface ServerType {
  id: string;
  channelAllowed: string[];
  charmeChroma: boolean;
  language: string;
  savePokemon: SaveAllPokemonType;
  eventSpawn: EventSpawnType;

  maxCountMessage: number;
  countMessage: number;
  pokemonPresent: Record<string, PokemonType>;

  getPokemonByIdChannel(idChannel: string): Pokemon | null;
  removePokemonByIdChannel(idChannel: string): void;
}
