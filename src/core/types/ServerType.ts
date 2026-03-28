import { EventSpawnType } from "./EventSpawnType";
import { PokemonType } from "./PokemonType";
import { SaveAllPokemonType } from "./SaveAllPokemonType";
import { Pokemon } from "../classes/Pokemon";

export interface ServerSettings {
  language: string;
  spawnMax: number;
  spawnMin: number;
}

export interface ServerType {
  discordId: string;
  channelAllowed: string[];
  charmeChroma: boolean;
  settings: ServerSettings;
  savePokemon: SaveAllPokemonType;
  eventSpawn: EventSpawnType;

  maxCountMessage: number;
  countMessage: number;
  pokemonPresent: Record<string, PokemonType>;

  getPokemonByIdChannel(idChannel: string): Pokemon | null;
  removePokemonByIdChannel(idChannel: string): void;
}
