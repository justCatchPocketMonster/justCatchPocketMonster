import eventData from "../../data/json/eventData.json";
import { ServerType } from "../../core/types/ServerType";
import { updateServer } from "../../cache/ServerCache";
import { deepCloneObject, random } from "../../utils/helperFunction";
import getText from "../../lang/language";
import { valuePerType, valuePerGen } from "../../config/default/spawn";
import { EventSpawn } from "../../core/classes/EventSpawn";
import language from "../../data/json/language.json";
import { Event } from "../../core/classes/Event";
import type { LanguageKey } from "../../lang/language";
import { TypeStat, GenStat } from "../../core/types/EventSpawnType";

export const selectEventStandard = async (server: ServerType) => {
  let randomEvent = eventData[random(eventData.length)];
  const event = new Event(
    randomEvent.id.toString(),
    randomEvent.name as LanguageKey,
    randomEvent.description as LanguageKey,
    randomEvent.type,
    randomEvent.color,
    randomEvent.image,
    "",
    new Date(Date.now() + 30 * 60 * 1000),
    randomEvent.statMultipliers,
  );

  const eventSpawn = EventSpawn.createDefault(server.settings);
  eventSpawn.whatEvent = event;

  effectEvent(eventSpawn, server);
  server.eventSpawn = deepCloneObject(eventSpawn);
  await updateServer(server.discordId, server);
};

const DURATIONS = {
  level1: 15 * 60 * 1000,
  level2: 30 * 60 * 1000,
  level3: 60 * 60 * 1000,
};

const imagePerLvl = ["0012-000", "0012-001", "0012-002"];
const effectEvent = (eventSpawn: EventSpawn, server: ServerType) => {
  const level = getLevel();
  const eventId = eventSpawn.whatEvent!.id;
  const statMultipliers = eventSpawn.whatEvent?.statMultipliers;

  if (!statMultipliers) return;

  const levelKey = `level${level}` as keyof typeof statMultipliers;
  const multipliers = statMultipliers[levelKey];

  let pickedGen: keyof GenStat | undefined;
  let pickedType: keyof TypeStat | undefined;

  if (multipliers.generationRandom) {
    pickedGen = getRandomGen();
    multipliers[pickedGen] = multipliers.generationRandom;
  }

  if (multipliers.typeRandom) {
    pickedType = getRandomType();
    multipliers[pickedType] = multipliers.typeRandom;
  }

  eventSpawn.applyModifiersInPlace(multipliers);

  setEventTextEffect(eventId, level, server, pickedGen, pickedType);

  if (eventId === "9") {
    eventSpawn.whatEvent!.image = imagePerLvl[level - 1];
  }

  if (eventId === "10" || eventId === "7") {
    eventSpawn.whatEvent!.endTime = addDuration(DURATIONS[levelKey]);
  }

  function capitalizeTypeKey(t: keyof TypeStat): string {
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function setEventTextEffect(
    eventId: string,
    lvl: number,
    server: ServerType,
    randomGen?: keyof GenStat,
    randomType?: keyof TypeStat,
  ) {
    const eventHandlers: Record<string, () => string> = {
      "1": () =>
        `${getText("auraLegendary", server.settings.language)}${lvl}. ${getText("pendantTrenteMinute", server.settings.language)}`,
      "2": () => getText("nothing", server.settings.language),
      "3": () =>
        `${getText("auraGeneration", server.settings.language)}${lvl}${randomGen ? ` (Gen. ${randomGen})` : ""}. ${getText("pendantTrenteMinute", server.settings.language)}`,
      "4": () =>
        `${getText("auraMythical", server.settings.language)}${lvl}. ${getText("pendantTrenteMinute", server.settings.language)}`,
      "5": () =>
        `${getText("auraType", server.settings.language)}${lvl}${randomType ? ` (${capitalizeTypeKey(randomType)})` : ""}. ${getText("pendantTrenteMinute", server.settings.language)}`,
      "6": () =>
        `${getText("auraChroma", server.settings.language)}${lvl}. ${getText("pendantTrenteMinute", server.settings.language)}`,
      "7": () =>
        `${getText("auraMega", server.settings.language)}${lvl}. ${getDurationText(lvl)}`,
      "8": () =>
        `${getText("auraEncen", server.settings.language)}${lvl}. ${getText("pendantTrenteMinute", server.settings.language)}`,
      "9": () =>
        `${getText("auraRepousse", server.settings.language)}${lvl}. ${getText("pendantTrenteMinute", server.settings.language)}`,
      "10": () =>
        `${getText("auraNuit", server.settings.language)}${lvl}. ${getDurationText(lvl)}`,
      "11": () =>
        `${getText("auraOvale", server.settings.language)}${lvl}. ${getText("pendantTrenteMinute", server.settings.language)}`,
      "12": () =>
        `${getText("auraUltraBeast", server.settings.language)}${lvl}. ${getText("pendantTrenteMinute", server.settings.language)}`,
    };

    const handler = eventHandlers[eventId];
    if (handler) {
      eventSpawn.whatEvent!.effectDescription = handler();
    }
  }

  type LanguageKey = keyof typeof language;
  function getDurationText(lvl: number) {
    let key: LanguageKey;
    if (lvl === 3) {
      key = "pendantUneHeure";
    } else if (lvl === 2) {
      key = "pendantTrenteMinute";
    } else {
      key = "pendantQuinzeMinute";
    }
    return getText(key, server.settings.language);
  }
};
function getRandomGen(): keyof GenStat {
  const gen = Object.keys(valuePerGen) as (keyof GenStat)[];
  return gen[random(gen.length)];
}

function getRandomType(): keyof TypeStat {
  const types = Object.keys(valuePerType) as (keyof TypeStat)[];
  return types[random(types.length)];
}

function addDuration(ms: number) {
  return new Date(Date.now() + ms);
}

function getLevel() {
  const rand = random(100);
  let level: number;
  if (rand >= 99) {
    level = 3;
  } else if (rand >= 70) {
    level = 2;
  } else {
    level = 1;
  }
  return level;
}
