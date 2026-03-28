import { EventType } from "../types/EventType";
import {
  EventSpawnType,
  GenStat,
  RarityStat,
  TypeStat,
} from "../types/EventSpawnType";
import {
  rateMaxShiny,
  valueMaxChoiceEgg,
  valueMaxChoiceRaid,
  valuePerGen,
  valuePerRarity,
  valuePerType,
} from "../../config/default/spawn";
import { deepCloneObject } from "../../utils/helperFunction";
import { EventSpawnFlatModsStrict } from "../types/EventSpawnFlatModsLooseType";
import { selectEventSeasonal } from "../../features/event/selectEventSeasonal";
import { ServerSettings } from "../types/ServerType";

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
    public valueMaxChoiceRaid: number,
  ) {}

  public applyModifiersInPlace(percentageMods: EventSpawnFlatModsStrict): void {
    if (percentageMods) {
      applyPercentageToNumericStats(this.gen, percentageMods);
      applyPercentageToNumericStats(this.type, percentageMods);
      applyPercentageToNumericStats(this.rarity, percentageMods);

      this.shiny = applyNumericMod(this.shiny, percentageMods.shiny);
      this.valueMaxChoiceEgg = applyNumericMod(
        this.valueMaxChoiceEgg,
        percentageMods.valueMaxChoiceEgg,
      );
      this.valueMaxChoiceRaid = applyNumericMod(
        this.valueMaxChoiceRaid,
        percentageMods.valueMaxChoiceRaid,
      );
      this.messageSpawn.min = applyNumericMod(
        this.messageSpawn.min,
        percentageMods.min,
      );
      this.messageSpawn.max = applyNumericMod(
        this.messageSpawn.max,
        percentageMods.max,
      );

      this.allowedForm.mega = applyBoolMod(
        this.allowedForm.mega,
        percentageMods.mega,
      );
      this.allowedForm.giga = applyBoolMod(
        this.allowedForm.giga,
        percentageMods.giga,
      );
      this.nightMode = applyBoolMod(this.nightMode, percentageMods.nightMode);
      this.whatEvent = percentageMods.whatEvent ?? this.whatEvent;
    }
  }

  static createDefault(serverSettings: ServerSettings): EventSpawn {
    const defaultEventSpawn = new EventSpawn(
      deepCloneObject(valuePerGen),
      deepCloneObject(valuePerType),
      deepCloneObject(valuePerRarity),
      rateMaxShiny,
      null,
      { mega: false, giga: false },
      {
        min: serverSettings.spawnMin,
        max: serverSettings.spawnMax,
      },
      false,
      valueMaxChoiceEgg,
      valueMaxChoiceRaid,
    );

    const eventSeason = selectEventSeasonal();
    if (eventSeason) {
      defaultEventSpawn.applyModifiersInPlace(eventSeason.statMultipliers);
    }
    return defaultEventSpawn;
  }
}

const computePercentage = (current: number, percentDelta: number): number =>
  Math.floor(current * (1 + percentDelta / 100) * 100) / 100;

function applyNumericMod(
  current: number,
  percentDelta: number | undefined,
): number {
  if (percentDelta !== undefined) {
    return computePercentage(current, percentDelta);
  }
  return current;
}

function applyBoolMod(current: boolean, value: boolean | undefined): boolean {
  return value ?? current;
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
      if (updatedValue === currentValue) {
        continue;
      }
      numericStats[statKey] = updatedValue;
    }
  }
}
