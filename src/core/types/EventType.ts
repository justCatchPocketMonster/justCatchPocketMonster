import type { LanguageKey } from "../../lang/language";
import type { EventSpawnFlatModsStrict } from "./EventSpawnFlatModsLooseType";

export interface EventType {
  id: string;
  name: LanguageKey;
  description: LanguageKey;
  type: string;
  color: string;
  image: string;
  effectDescription: string;
  endTime: Date;
  statMultipliers?: {
    level1: EventSpawnFlatModsStrict;
    level2: EventSpawnFlatModsStrict;
    level3: EventSpawnFlatModsStrict;
  };
}
