import { EventSpawn } from "./EventSpawn";
import { Pokemon } from "./Pokemon";
import { ServerType, ServerSettings } from "../types/ServerType";
import { defaultLanguage } from "../../config/default/server";
import { SaveAllPokemon } from "./SaveAllPokemon";
import { Event } from "./Event";
import type { LanguageKey } from "../../lang/language";
import {
  maximumCount,
  minimumCount,
  valueMaxChoiceRaid,
} from "../../config/default/spawn";

export class Server implements ServerType {
  constructor(
    public discordId: string,
    public channelAllowed: string[],
    public charmeChroma: boolean,
    public settings: ServerSettings,
    public savePokemon: SaveAllPokemon,
    public eventSpawn: EventSpawn,
    public maxCountMessage: number,
    public countMessage: number,
    public pokemonPresent: Record<string, Pokemon>,
  ) {}

  getPokemonByIdChannel(idChannel: string): Pokemon | null {
    const key = idChannel;
    if (this.pokemonPresent[key]) {
      return Pokemon.from(this.pokemonPresent[key]);
    }
    return null;
  }

  removePokemonByIdChannel(idChannel: string): void {
    const key = idChannel;
    if (this.pokemonPresent[key]) {
      delete this.pokemonPresent[key];
    }
  }

  static fromMongo(data: ServerType): Server {
    const savePokemon = SaveAllPokemon.fromMongo(data.savePokemon ?? {});

    const pokemonPresent: Record<string, Pokemon> = {};
    for (const [key, value] of Object.entries(data.pokemonPresent ?? {})) {
      pokemonPresent[key] = new Pokemon(
        value.id,
        value.name,
        value.arrayType,
        value.rarity,
        value.imgName,
        value.gen,
        value.form,
        value.versionForm,
        value.isShiny,
        value.hint,
        value.canSosBattle ?? false,
        value.sosChainLvl,
      );
    }

    const e = data.eventSpawn;
    const whatEvent = e.whatEvent
      ? new Event(
          e.whatEvent.id,
          e.whatEvent.name,
          e.whatEvent.description,
          e.whatEvent.type,
          e.whatEvent.color,
          e.whatEvent.image,
          e.whatEvent.effectDescription,
          new Date(e.whatEvent.endTime),
          e.whatEvent.statMultipliers,
        )
      : null;
    const eventSpawn = new EventSpawn(
      e.gen,
      e.type,
      e.rarity,
      e.shiny,
      whatEvent,
      e.allowedForm,
      e.messageSpawn,
      e.nightMode,
      e.valueMaxChoiceEgg,
      e.valueMaxChoiceRaid ?? valueMaxChoiceRaid,
    );

    const settings: ServerSettings = data.settings ?? {
      language: (data as any).language ?? defaultLanguage,
      spawnMax: maximumCount,
      spawnMin: minimumCount,
    };

    return new Server(
      data.discordId,
      data.channelAllowed,
      data.charmeChroma,
      settings,
      savePokemon,
      eventSpawn,
      data.maxCountMessage,
      data.countMessage,
      pokemonPresent,
    );
  }

  static createDefault(id: string): Server {
    const saveAllPokemon: SaveAllPokemon = new SaveAllPokemon();
    saveAllPokemon.initMissingPokemons();
    return new Server(
      id,
      [], // channelAllowed
      false,
      {
        language: defaultLanguage,
        spawnMax: maximumCount,
        spawnMin: minimumCount,
      },
      saveAllPokemon, // savePokemon
      EventSpawn.createDefault({
        language: defaultLanguage,
        spawnMax: maximumCount,
        spawnMin: minimumCount,
      }),
      10,
      0,
      {}, // pokemonPresent
    );
  }
}
