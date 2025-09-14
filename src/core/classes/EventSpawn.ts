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
  applyModifiersInPlace(modifiers: Record<string, any>): boolean {
    let changed = false;

    function apply(target: any, source: any) {
      for (const key in source) {
        const value = source[key];

        if (value === null || value === undefined) {
          continue;
        }

        if (typeof value === "number") {
          if (typeof target[key] === "number") {
            const original = target[key];
            const next = Math.floor(original * (1 + value / 100));
            if (next !== original) changed = true;
            target[key] = next;
          } else {
            if (target[key] !== value) changed = true;
            target[key] = value;
          }
        } else if (typeof value === "object" && !Array.isArray(value)) {
          if (!target[key]) {
            target[key] = {};
            changed = true;
          }
          apply(target[key], value);
        } else {
          if (target[key] !== value) changed = true;
          target[key] = value;
        }
      }
    }

    apply(this as Record<string, any>, modifiers);
    return changed;
  }

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
