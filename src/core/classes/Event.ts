import { EventType } from "../types/EventType";
import { LanguageKey } from "../../lang/language";

export class Event implements EventType {
  constructor(
    public id: string,
    public name: LanguageKey,
    public description: LanguageKey,
    public type: string,
    public color: string,
    public image: string,
    public effectDescription: string,
    public endTime: Date,
    public statMultipliers?: {
      level1: Record<string, any>;
      level2: Record<string, any>;
      level3: Record<string, any>;
    },
  ) {}
}
