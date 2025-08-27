import { Event } from "./Event";
import {
  EventSpawnType,
  GenStat,
  RarityStat,
  TypeStat,
} from "../types/EventSpawnType";
import { defaultLanguage } from "../../config/default/server";
import {
  maximumCount,
  minimumCount,
  rateMaxShiny,
  valueMaxChoiceEgg,
  valuePerGen,
  valuePerRarity,
  valuePerType,
} from "../../config/default/spawn";
import { deepCloneObject } from "../../utils/helperFunction";

export class EventSpawn implements EventSpawnType {
  constructor(
    public gen: GenStat,
    public type: TypeStat,
    public rarity: RarityStat,
    public shiny: number,
    public whatEvent: Event | null,
    public allowedForm: {
      mega: boolean;
      giga: boolean;
    },
    public messageSpawn: {
      min: number;
      max: number;
    },
    public nightMode: boolean,
    public valueMaxChoiceEgg: number,
  ) {}

  static createDefault(): EventSpawn {
    const defaultEventSpawn = new EventSpawn(
      deepCloneObject(valuePerGen),
      deepCloneObject(valuePerType),
      deepCloneObject(valuePerRarity),
      rateMaxShiny,
      null,
      { mega: false, giga: false },
      {
        min: minimumCount,
        max: maximumCount,
      },
      false,
      valueMaxChoiceEgg,
    );
    return defaultEventSpawn;
  }
}
