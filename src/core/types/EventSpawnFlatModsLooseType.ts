import { EventType } from "./EventType";
import { GenStat, TypeStat, RarityStat } from "./EventSpawnType";

// Un pourcentage (ex: 20 = +20%, -30 = -30%)
export type Percent = number;

type NumericMods<T> = Partial<Record<keyof T, Percent>>;

export type EventSpawnFlatModsStrict = NumericMods<GenStat> &
  NumericMods<TypeStat> &
  NumericMods<RarityStat> &
  Partial<{
    shiny: Percent;
    valueMaxChoiceEgg: Percent;
    min: Percent;
    max: Percent;

    mega: boolean;
    giga: boolean;
    nightMode: boolean;
    whatEvent: EventType | null;
  }>;
