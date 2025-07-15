import mongoose from "mongoose";
import { EventSpawnType } from "../types/EventSpawnType";
import {
  defaultValueGen,
  defaultValueType,
  defaultRarity,
  tauxMaxShiny,
  maximumCount,
  minimumCount,
} from "../../config/default/defaultValue";

export const EventSpawnSchema = new mongoose.Schema<EventSpawnType>(
  {
    gen: {
      "1": {
        type: Number,
        required: true,
        default: defaultValueGen[1],
      },
      "2": {
        type: Number,
        required: true,
        default: defaultValueGen[2],
      },
      "3": {
        type: Number,
        required: true,
        default: defaultValueGen[3],
      },
      "4": {
        type: Number,
        required: true,
        default: defaultValueGen[4],
      },
      "5": {
        type: Number,
        required: true,
        default: defaultValueGen[5],
      },
      "6": {
        type: Number,
        required: true,
        default: defaultValueGen[6],
      },
      "7": {
        type: Number,
        required: true,
        default: defaultValueGen[7],
      },
      "8": {
        type: Number,
        required: true,
        default: defaultValueGen[8],
      },
      "9": {
        type: Number,
        required: true,
        default: defaultValueGen[9],
      },
    },
    type: {
      Steel: {
        type: Number,
        required: true,
        default: defaultValueType.Steel,
      },
      Dragon: {
        type: Number,
        required: true,
        default: defaultValueType.Dragon,
      },
      Electric: {
        type: Number,
        required: true,
        default: defaultValueType.Electric,
      },
      Fire: {
        type: Number,
        required: true,
        default: defaultValueType.Fire,
      },
      Bug: {
        type: Number,
        required: true,
        default: defaultValueType.Bug,
      },
      Grass: {
        type: Number,
        required: true,
        default: defaultValueType.Grass,
      },
      Psychic: {
        type: Number,
        required: true,
        default: defaultValueType.Psychic,
      },
      Ground: {
        type: Number,
        required: true,
        default: defaultValueType.Ground,
      },
      Dark: {
        type: Number,
        required: true,
        default: defaultValueType.Dark,
      },
      Fighting: {
        type: Number,
        required: true,
        default: defaultValueType.Fighting,
      },
      Water: {
        type: Number,
        required: true,
        default: defaultValueType.Water,
      },
      Fairy: {
        type: Number,
        required: true,
        default: defaultValueType.Fairy,
      },
      Ice: {
        type: Number,
        required: true,
        default: defaultValueType.Ice,
      },
      Normal: {
        type: Number,
        required: true,
        default: defaultValueType.Normal,
      },
      Poison: {
        type: Number,
        required: true,
        default: defaultValueType.Poison,
      },
      Rock: {
        type: Number,
        required: true,
        default: defaultValueType.Rock,
      },
      Ghost: {
        type: Number,
        required: true,
        default: defaultValueType.Ghost,
      },
      Flying: {
        type: Number,
        required: true,
        default: defaultValueType.Flying,
      },
    },
    rarity: {
      ordinaire: {
        type: Number,
        required: true,
        default: defaultRarity.ordinaire,
      },
      legendaire: {
        type: Number,
        required: true,
        default: defaultRarity.legendaire,
      },
      fabuleux: {
        type: Number,
        required: true,
        default: defaultRarity.fabuleux,
      },
    },
    shiny: {
      type: Number,
      required: true,
      default: tauxMaxShiny,
    },
    endTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    whatEvent: {
      id: {
        type: String,
        required: true,
        default: "",
      },
      name: {
        type: String,
        required: true,
        default: "",
      },
      description: {
        type: String,
        required: true,
        default: "",
      },
      type: {
        type: String,
        required: true,
        default: "",
      },
      color: {
        type: String,
        required: true,
        default: "",
      },
      image: {
        type: String,
        required: true,
        default: "",
      },
      effectDescription: {
        type: String,
        required: true,
        default: "",
      },
    },
    allowedForm: {
      mega: {
        type: Boolean,
        required: true,
        default: false,
      },
      giga: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    messageSpawn: {
      min: {
        type: Number,
        required: true,
        default: minimumCount,
      },
      max: {
        type: Number,
        required: true,
        default: maximumCount,
      },
    },
    nightMode: {
      type: Boolean,
      required: true,
      default: false,
    },
    valeurMaxChoiceEgg: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
