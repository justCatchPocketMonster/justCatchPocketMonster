import { LanguageKey } from "../../lang/language";

export interface EventSeasonnal {
  id: number;
  name: LanguageKey;
  description: LanguageKey;
  startDate: Date | null;
  endDate: Date | null;
  image: string | null;
  statMultipliers: Record<string, any>;
}
