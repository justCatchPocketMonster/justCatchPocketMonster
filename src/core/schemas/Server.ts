import mongoose from "mongoose";
import { ServerType } from "../types/ServerType";
import { SaveOnePokemonSchema } from "./SaveOnePokemon";
import { PokemonSchema } from "./Pokemon";
import { EventSpawnSchema } from "./EventSpawn";
import { SaveAllPokemonSchema } from "./SaveAllPokemon";
import { Pokemon } from "../classes/Pokemon";

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
    language: {
      type: String,
      required: true,
      default: "eng",
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
