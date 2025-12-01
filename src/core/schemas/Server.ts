import mongoose from "mongoose";
import { ServerType, ServerSettings } from "../types/ServerType";
import { SaveOnePokemonSchema } from "./SaveOnePokemon";
import { PokemonSchema } from "./Pokemon";
import { EventSpawnSchema } from "./EventSpawn";
import { SaveAllPokemonSchema } from "./SaveAllPokemon";
import { Pokemon } from "../classes/Pokemon";
import { defaultLanguage } from "../../config/default/server";
import { maximumCount, minimumCount } from "../../config/default/spawn";

const ServerSettingsSchema = new mongoose.Schema<ServerSettings>(
  {
    language: {
      type: String,
      required: true,
      default: defaultLanguage,
    },
    spawnMax: {
      type: Number,
      required: true,
      default: maximumCount,
    },
    spawnMin: {
      type: Number,
      required: true,
      default: minimumCount,
    },
  },
  {
    _id: false,
  },
);

const ServerSchema = new mongoose.Schema<ServerType>(
  {
    discordId: {
      type: String,
      required: true,
    },
    channelAllowed: {
      type: [String],
      required: true,
      default: [],
    },
    charmeChroma: {
      type: Boolean,
      required: true,
      default: false,
    },
    settings: {
      type: ServerSettingsSchema,
      required: true,
      default: () => ({
        language: defaultLanguage,
        spawnMax: maximumCount,
        spawnMin: minimumCount,
      }),
    },
    savePokemon: {
      type: SaveAllPokemonSchema,
      required: true,
    },
    eventSpawn: {
      type: EventSpawnSchema,
      required: true,
    },
    maxCountMessage: {
      type: Number,
      required: true,
      default: 0,
    },
    countMessage: {
      type: Number,
      required: true,
      default: 0,
    },
    pokemonPresent: {
      type: Map,
      of: PokemonSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Server = mongoose.model<ServerType>("Server", ServerSchema);
