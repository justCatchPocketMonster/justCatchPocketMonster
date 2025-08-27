import language from "../data/language.json";
import { newLogger } from "../middlewares/logger";

interface Translation {
  [key: string]: string[];
}

interface LanguageStructure {
  [key: string]: Translation;
}

export default function getText(key: string, lang: string): string {
  try {
    const languageData: LanguageStructure = language;
    const langTextArray = languageData[key]?.[lang] ?? [];
    if (langTextArray.length === 0) {
      langTextArray.push("Error: Key not found");
    }

    const randomTextIndex = Math.floor(Math.random() * langTextArray.length);

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
