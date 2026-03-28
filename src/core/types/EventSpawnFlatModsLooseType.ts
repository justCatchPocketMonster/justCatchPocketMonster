import type { EventType } from "./EventType";
import type { GenStat, TypeStat, RarityStat } from "./EventSpawnType";

type NumericMods<T> = Partial<Record<keyof T, number>>;

export type EventSpawnFlatModsStrict = NumericMods<GenStat> &
  NumericMods<TypeStat> &
  NumericMods<RarityStat> &
  Partial<{
    generationRandom: number;
    typeRandom: number;
    shiny: number;
    valueMaxChoiceEgg: number;
    valueMaxChoiceRaid: number;
    min: number;
    max: number;

    mega: boolean;
    giga: boolean;
    nightMode: boolean;
    whatEvent: EventType | null;
  }>;
