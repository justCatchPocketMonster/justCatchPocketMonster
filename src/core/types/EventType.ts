import { LanguageKey } from "../../lang/language";

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
    level1: Record<string, any>;
    level2: Record<string, any>;
    level3: Record<string, any>;
  };
}
