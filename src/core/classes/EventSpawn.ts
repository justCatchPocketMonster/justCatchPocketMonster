import { EventType } from "../types/EventType";
import {
  EventSpawnType,
  GenStat,
  RarityStat,
  TypeStat,
} from "../types/EventSpawnType";
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
import { EventSpawnFlatModsStrict } from "../types/EventSpawnFlatModsLooseType";

export class EventSpawn implements EventSpawnType {
  constructor(
    public gen: GenStat,
    public type: TypeStat,
    public rarity: RarityStat,
    public shiny: number,
    public whatEvent: EventType | null,
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

  public applyModifiersInPlace(percentageMods: EventSpawnFlatModsStrict): void {
    if (!percentageMods) return;

    applyPercentageToNumericStats(this.gen, percentageMods);
    applyPercentageToNumericStats(this.type, percentageMods);
    applyPercentageToNumericStats(this.rarity, percentageMods);

    if (percentageMods.shiny !== undefined) {
      const updatedValue = computePercentage(this.shiny, percentageMods.shiny);
      if (updatedValue !== this.shiny) this.shiny = updatedValue;
    }
    if (percentageMods.valueMaxChoiceEgg !== undefined) {
      const updatedValue = computePercentage(
        this.valueMaxChoiceEgg,
        percentageMods.valueMaxChoiceEgg,
      );
      if (updatedValue !== this.valueMaxChoiceEgg)
        this.valueMaxChoiceEgg = updatedValue;
    }
    if (percentageMods.min !== undefined) {
      const updatedValue = computePercentage(
        this.messageSpawn.min,
        percentageMods.min,
      );
      if (updatedValue !== this.messageSpawn.min)
        this.messageSpawn.min = updatedValue;
    }
    if (percentageMods.max !== undefined) {
      const updatedValue = computePercentage(
        this.messageSpawn.max,
        percentageMods.max,
      );
      if (updatedValue !== this.messageSpawn.max)
        this.messageSpawn.max = updatedValue;
    }

    // booléens
    if (
      percentageMods.mega !== undefined &&
      this.allowedForm.mega !== percentageMods.mega
    ) {
      this.allowedForm.mega = percentageMods.mega;
    }
    if (
      percentageMods.giga !== undefined &&
      this.allowedForm.giga !== percentageMods.giga
    ) {
      this.allowedForm.giga = percentageMods.giga;
    }
    if (
      percentageMods.nightMode !== undefined &&
      this.nightMode !== percentageMods.nightMode
    ) {
      this.nightMode = percentageMods.nightMode;
    }

    // tag d’événement
    if (
      percentageMods.whatEvent !== undefined &&
      this.whatEvent !== percentageMods.whatEvent
    ) {
      this.whatEvent = percentageMods.whatEvent ?? null;
    }
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

const computePercentage = (current: number, percentDelta: number): number =>
  Math.floor(current * (1 + percentDelta / 100) * 100) / 100;

function keysOf<T extends object>(obj: T): Array<Extract<keyof T, string>> {
  return Object.keys(obj) as Array<Extract<keyof T, string>>;
}

type NumericKeys<T> = {
  [K in keyof T]-?: T[K] extends number ? K : never;
}[keyof T];

function applyPercentageToNumericStats<T extends object>(
  statsObject: T,
  percentageMods: Partial<Record<NumericKeys<T>, number>>,
): void {
  const keys = Object.keys(statsObject) as Array<NumericKeys<T>>;
  const numericStats = statsObject as unknown as Record<NumericKeys<T>, number>;
  for (const statKey of keys) {
    const percentDelta = percentageMods[statKey];
    if (percentDelta !== undefined) {
      const currentValue = numericStats[statKey];
      const updatedValue = computePercentage(currentValue, percentDelta);
      if (updatedValue !== currentValue) {
        numericStats[statKey] = updatedValue;
      }
    }
  }
}
