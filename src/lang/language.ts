import language from "../data/language.json";
import logger from "../middlewares/error";

interface Translation {
  [key: string]: string[];
}

interface languageStructure {
  [key: string]: Translation;
}

export default function getText(key: string, lang: string): string {
  try {
    const languageData: languageStructure = language;
    const langTextArray = languageData[key]?.[lang] ?? [];
    if (langTextArray.length === 0) {
      throw new Error("Key not found :" + key);
    }

    const randomTextIndex = Math.floor(Math.random() * langTextArray.length);

    return langTextArray[randomTextIndex];
  } catch (e) {
    logger.error(e);
    return "Error: Key not found";
  }
}
