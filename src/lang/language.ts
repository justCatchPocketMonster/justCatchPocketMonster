import language from "../data/json/language.json";
import { newLogger } from "../middlewares/logger";
import { random } from "../utils/helperFunction";

interface Translation {
  [key: string]: string[];
}

interface LanguageStructure {
  [key: string]: Translation;
}

type LanguageKey = keyof typeof language;

export default function getText(key: LanguageKey, lang: string): string {
  try {
    const languageData: LanguageStructure = language;
    const langTextArray = languageData[key]?.[lang] ?? [];
    if (langTextArray.length === 0) {
      langTextArray.push("Error: Key not found");
    }

    const randomTextIndex = random(langTextArray.length);

    return langTextArray[randomTextIndex];
  } catch (e) {
    newLogger(
      "error",
      e as string,
      `Error in getText function for key: ${key} language: ${lang}`,
    );
    return "Error: Key not found";
  }
}

export function getAvailableKeys(): LanguageKey[] {
  return Object.keys(language) as LanguageKey[];
}

export type { LanguageKey };
