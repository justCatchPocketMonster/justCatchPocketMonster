import mongoose from "mongoose";
import { StatType } from "../types/StatType";
import { SaveAllPokemonSchema } from "./SaveAllPokemon";

const StatSchema = new mongoose.Schema<StatType>(
  {
    version: {
      type: String,
      required: true,
      unique: true,
    },
    pokemonSpawned: {
      type: Number,
      required: true,
    },
    pokemonSpawnedShiny: {
      type: Number,
      required: true,
      default: 0,
    },
    pokemonCaught: {
      type: Number,
      required: true,
    },
    pokemonCaughtShiny: {
      type: Number,
      required: true,
      default: 0,
    },
    savePokemonSpawn: {
      type: SaveAllPokemonSchema,
      required: true,
    },
    savePokemonCatch: {
      type: SaveAllPokemonSchema,
      required: true,
    },
    bestSosChain: {
      type: Number,
      required: true,
      default: 0,
    },
    raidsAppeared: {
      type: Number,
      required: true,
      default: 0,
    },
    raidsWon: {
      type: Number,
      required: true,
      default: 0,
    },
    raidsLost: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Stat = mongoose.model<StatType>("Stat", StatSchema);
