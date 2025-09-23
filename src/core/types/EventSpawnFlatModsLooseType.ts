import type { EventType } from "./EventType";
import type { GenStat, TypeStat, RarityStat } from "./EventSpawnType";

export type Percent = number;

type NumericMods<T> = Partial<Record<keyof T, Percent>>;

export type EventSpawnFlatModsStrict = NumericMods<GenStat> &
  NumericMods<TypeStat> &
  NumericMods<RarityStat> &
  Partial<{
    generationRandom: Percent;
    typeRandom: Percent;
    shiny: Percent;
    valueMaxChoiceEgg: Percent;
    min: Percent;
    max: Percent;

    mega: boolean;
    giga: boolean;
    nightMode: boolean;
    whatEvent: EventType | null;
  }>;
