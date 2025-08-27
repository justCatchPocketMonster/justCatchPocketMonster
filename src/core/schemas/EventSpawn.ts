import mongoose from "mongoose";
import { EventSpawnType } from "../types/EventSpawnType";
import {
  maximumCount,
  minimumCount,
  rateMaxShiny,
  valuePerGen,
  valuePerRarity,
  valuePerType,
} from "../../config/default/spawn";
import { EventSchema } from "./Event";

export const EventSpawnSchema = new mongoose.Schema<EventSpawnType>(
  {
    gen: {
      "1": {
        type: Number,
        required: true,
        default: valuePerGen[1],
      },
      "2": {
        type: Number,
        required: true,
        default: valuePerGen[2],
      },
      "3": {
        type: Number,
        required: true,
        default: valuePerGen[3],
      },
      "4": {
        type: Number,
        required: true,
        default: valuePerGen[4],
      },
      "5": {
        type: Number,
        required: true,
        default: valuePerGen[5],
      },
      "6": {
        type: Number,
        required: true,
        default: valuePerGen[6],
      },
      "7": {
        type: Number,
        required: true,
        default: valuePerGen[7],
      },
      "8": {
        type: Number,
        required: true,
        default: valuePerGen[8],
      },
      "9": {
        type: Number,
        required: true,
        default: valuePerGen[9],
      },
    },
    type: {
      steel: {
        type: Number,
        required: true,
        default: valuePerType.steel,
      },
      dragon: {
        type: Number,
        required: true,
        default: valuePerType.dragon,
      },
      electric: {
        type: Number,
        required: true,
        default: valuePerType.electric,
      },
      fire: {
        type: Number,
        required: true,
        default: valuePerType.fire,
      },
      bug: {
        type: Number,
        required: true,
        default: valuePerType.bug,
      },
      grass: {
        type: Number,
        required: true,
        default: valuePerType.grass,
      },
      psychic: {
        type: Number,
        required: true,
        default: valuePerType.psychic,
      },
      ground: {
        type: Number,
        required: true,
        default: valuePerType.ground,
      },
      dark: {
        type: Number,
        required: true,
        default: valuePerType.dark,
      },
      fighting: {
        type: Number,
        required: true,
        default: valuePerType.fighting,
      },
      water: {
        type: Number,
        required: true,
        default: valuePerType.water,
      },
      fairy: {
        type: Number,
        required: true,
        default: valuePerType.fairy,
      },
      ice: {
        type: Number,
        required: true,
        default: valuePerType.ice,
      },
      normal: {
        type: Number,
        required: true,
        default: valuePerType.normal,
      },
      poison: {
        type: Number,
        required: true,
        default: valuePerType.poison,
      },
      rock: {
        type: Number,
        required: true,
        default: valuePerType.rock,
      },
      ghost: {
        type: Number,
        required: true,
        default: valuePerType.ghost,
      },
      flying: {
        type: Number,
        required: true,
        default: valuePerType.flying,
      },
    },
    rarity: {
      ordinary: {
        type: Number,
        required: true,
        default: valuePerRarity.ordinary,
      },
      legendary: {
        type: Number,
        required: true,
        default: valuePerRarity.legendary,
      },
      mythical: {
        type: Number,
        required: true,
        default: valuePerRarity.mythical,
      },
    },
    shiny: {
      type: Number,
      required: true,
      default: rateMaxShiny,
    },
    whatEvent: {
      type: EventSchema,
      required: false,
      default: null,
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
    valueMaxChoiceEgg: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
    timestamps: false,
  },
);
