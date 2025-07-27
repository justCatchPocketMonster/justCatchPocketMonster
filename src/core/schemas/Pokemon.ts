import mongoose from "mongoose";
import { PokemonType } from "../types/PokemonType";

export const PokemonSchema = new mongoose.Schema<PokemonType>(
  {
    id: { type: String, required: true },
    name: {
      nameFr: { type: [String], required: true },
      nameEng: { type: [String], required: true },
    },
    arrayType: { type: [String], required: true },
    rarity: { type: String, required: true },
    imgName: { type: String, required: true },
    gen: { type: Number, required: true },
    form: { type: String, required: true },
    versionForm: { type: Number, required: true },
    isShiny: { type: Boolean, required: true },
    hint: { type: String, required: true },
  },
  {
    _id: false,
    timestamps: false,
  },
);
