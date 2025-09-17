import eventData from "../../data/eventData.json";
import { ServerType } from "../../core/types/ServerType";
import { updateServer } from "../../cache/ServerCache";
import { deepCloneObject } from "../../utils/helperFunction";
import getText from "../../lang/language";
import { valuePerType, valuePerGen } from "../../config/default/spawn";
import { EventSpawn } from "../../core/classes/EventSpawn";
import language from "../../data/language.json";
import { Event } from "../../core/classes/Event";
import type { LanguageKey } from "../../lang/language";
import { TypeStat, GenStat } from "../../core/types/EventSpawnType";

export const selectEventStandard = async (server: ServerType) => {
  let randomEvent = eventData[Math.floor(Math.random() * eventData.length)];
  const event = new Event(
    randomEvent.id.toString(),
    randomEvent.name as LanguageKey,
    randomEvent.description as LanguageKey,
    randomEvent.type,
    randomEvent.color,
    randomEvent.image,
    "",
    new Date(Date.now() + 30 * 1000),
    randomEvent.statMultipliers,
  );

  const eventSpawn = EventSpawn.createDefault();
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
  const date = new Date();
  const level = getLevel();
  const eventId = eventSpawn.whatEvent!.id;
  const statMultipliers = eventSpawn.whatEvent?.statMultipliers;

  if (!statMultipliers) return;

  const levelKey = `level${level}` as keyof typeof statMultipliers;
  const multipliers = statMultipliers[levelKey];

  if (multipliers.generationRandom) {
    multipliers[getRandomGen()] = multipliers.generationRandom;
  }

  if (multipliers.typeRandom) {
    multipliers[getRandomType()] = multipliers.typeRandom;
  }

  eventSpawn.applyModifiersInPlace(multipliers);

  setEventTextEffect(eventId, level, server);

  if (eventId === "9") {
    eventSpawn.whatEvent!.image = imagePerLvl[level - 1];
  }

  if (eventId === "10" || eventId === "7") {
    eventSpawn.whatEvent!.endTime = addDuration(DURATIONS[levelKey]);
  }

  function setEventTextEffect(
    eventId: string,
    lvl: number,
    server: ServerType,
  ) {
    const eventHandlers: Record<string, () => string> = {
      "1": () =>
        `${getText("auraLegendary", server.language)}${lvl}. ${getText("pendantTrenteMinute", server.language)}`,
      "2": () => getText("nothing", server.language),
      "3": () =>
        `${getText("auraGeneration", server.language)}${lvl}. ${getText("pendantTrenteMinute", server.language)}`,
      "4": () =>
        `${getText("auraMythical", server.language)}${lvl}. ${getText("pendantTrenteMinute", server.language)}`,
      "5": () =>
        `${getText("auraType", server.language)}${lvl}. ${getText("pendantTrenteMinute", server.language)}`,
      "6": () =>
        `${getText("auraChroma", server.language)}${lvl}. ${getText("pendantTrenteMinute", server.language)}`,
      "7": () =>
        `${getText("auraMega", server.language)}${lvl}. ${getDurationText(lvl)}`,
      "8": () =>
        `${getText("auraEncen", server.language)}${lvl}. ${getText("pendantTrenteMinute", server.language)}`,
      "9": () =>
        `${getText("auraRepousse", server.language)}${lvl}. ${getText("pendantTrenteMinute", server.language)}`,
      "10": () =>
        `${getText("auraNuit", server.language)}${lvl}. ${getDurationText(lvl)}`,
      "11": () =>
        `${getText("auraOvale", server.language)}${lvl}. ${getText("pendantTrenteMinute", server.language)}`,
    };

    const handler = eventHandlers[eventId];
    if (handler) {
      eventSpawn.whatEvent!.effectDescription = handler();
    }
  }

  function getLevel() {
    const rand = Math.floor(Math.random() * 100);
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
    return getText(key, server.language);
  }

  function getRandomGen(): keyof GenStat {
    const gen = Object.keys(valuePerGen) as (keyof GenStat)[];
    return gen[Math.floor(Math.random() * gen.length)];
  }

  function getRandomType(): keyof TypeStat {
    const types = Object.keys(valuePerType) as (keyof TypeStat)[];
    return types[Math.floor(Math.random() * types.length)];
  }

  function addDuration(ms: number) {
    return new Date(date.getTime() + ms);
  }
};
