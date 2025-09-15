import { LanguageKey } from "../../lang/language";
import { EventSpawnFlatModsStrict } from "./EventSpawnFlatModsLooseType";

export interface EventType {
  id: string;
  name: LanguageKey;
  description: LanguageKey | string;
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
