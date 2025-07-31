import { EventType } from "../../core/types/EventType";
import { ServerType } from "../../core/types/ServerType";
import getText from "../../lang/language";
import { updateServer } from "../../cache/ServerCache";
import { nbGeneration, nbType, valuePerType } from "../../config/default/spawn";
import { genStat, typeStat } from "../../core/types/EventSpawnType";
import { capitalizeFirstLetter } from "../../utils/helperFunction";

interface ProbabilityType {
  [key: number]: number;
}

const DURATIONS = {
  fifteenMin: 15 * 60 * 1000,
  halfHour: 30 * 60 * 1000,
  oneHour: 60 * 60 * 1000,
};

const imagePerLvl = ["0012-000", "0012-001", "0012-002"];

export const effectEvent = async (event: EventType, server: ServerType): Promise<EventType> => {
  const date = new Date();
  const level = getLevel();

  const handlers: Record<string, () => void> = {
    "1": () => handleRarityEvent("legendary", [10, 25, 50]),
    "2": () => setEventTextEffect("nothing", 0),
    "3": () => handleGenerationEvent([5, 10, 20]),
    "4": () => handleRarityEvent("mythical", [2, 5, 10]),
    "5": () => handleTypeEvent([5, 10, 20]),
    "6": () => handleShinyEvent([1.25, 1.5, 2]),
    "7": () => handleTimeBasedEvent("megaAllow", "auraMega", [DURATIONS.fifteenMin, DURATIONS.halfHour, DURATIONS.oneHour]),
    "8": () => handleMaxMinMessageEvent([1, 2, 3], [5, 10, 15], "auraEncen"),
    "9": () => handleMaxMinMessageEvent([5, 7, 10], [20, 30, 40], "auraRepousse"),
    "10": () => handleTimeBasedEvent("setNightMode", "auraNuit", [DURATIONS.fifteenMin, DURATIONS.halfHour, DURATIONS.oneHour]),
    "11": () => handleEggEvent([200, 100, 50]),
  };

  handlers[event.id]?.();
  server.eventSpawn.whatEvent = event;

  if (event.id === "9") {
    server.eventSpawn.whatEvent.image = imagePerLvl[level - 1];
  }

  await updateServer(server.discordId, server);
  return event;


  function handleRarityEvent(type: "ordinary" | "legendary" | "mythical", values: number[]) {
    updateRarity(type, values[level - 1]);
    applyCommonDuration("aura" + capitalizeFirstLetter(type), DURATIONS.halfHour);
  }

  function handleGenerationEvent(values: number[]) {
    const gen = getRandomGen();
    adjustSpawnGen(values[level - 1], gen.toString());
    applyCommonDuration(
        "auraGeneration",
        DURATIONS.halfHour,
        `${getText("ofThisGeneration", server.language)}${gen}. `
    );
  }

  function handleTypeEvent(values: number[]) {
    const type = getRandomType();
    adjustSpawnType(values[level - 1], type);
    applyCommonDuration(
        "auraType",
        DURATIONS.halfHour,
        `${getText("ofThisType", server.language)}${getText(type, server.language)}. `
    );
  }

  function handleShinyEvent(values: number[]) {
    server.eventSpawn.shiny /= values[level - 1];
    applyCommonDuration("auraChroma", DURATIONS.halfHour);
  }

  function handleTimeBasedEvent(flag: string, eventKey: string, durations: number[]) {
    // @ts-ignore
    server.eventSpawn[flag] = !server.eventSpawn[flag];
    server.eventSpawn.whatEvent!.endTime = addDuration(durations[level - 1]);
    setEventTextEffect(eventKey, level, getDurationText(level));
  }

  function handleMaxMinMessageEvent(min: number[], max: number[], key: string) {
    server.eventSpawn.messageSpawn = { min: min[level - 1], max: max[level - 1] };
    applyCommonDuration(key, DURATIONS.halfHour);
  }

  function handleEggEvent(values: number[]) {
    server.eventSpawn.valeurMaxChoiceEgg = values[level - 1];
    applyCommonDuration("auraOvale", DURATIONS.halfHour);
  }

  // --- Helpers ---

  function applyCommonDuration(key: string, duration: number, extra: string = "") {
    server.eventSpawn.whatEvent!.endTime = addDuration(duration);
    setEventTextEffect(key, level, extra + getText("pendantTrenteMinute", server.language));
  }

  function setEventTextEffect(key: string, lvl: number, extra: string = "") {
    event.effectDescription = `${getText(key, server.language)}${lvl > 0 ? lvl : ""}. ${extra}`;
  }

  function getLevel() {
    const rand = Math.floor(Math.random() * 100);
    return rand >= 99 ? 3 : rand >= 70 ? 2 : 1;
  }

  function getDurationText(lvl: number) {
    return getText(
        lvl === 3 ? "pendantUneHeure" : lvl === 2 ? "pendantTrenteMinute" : "pendantQuinzeMinute",
        server.language
    );
  }

  function getRandomGen() {
    return Math.floor(Math.random() * nbGeneration) + 1;
  }

  function getRandomType() {
    const types = Object.keys(valuePerType);
    return types[Math.floor(Math.random() * types.length)];
  }

  function updateRarity(type: "ordinary" | "legendary" | "mythical", value: number) {
    server.eventSpawn.rarity[type] = value;
    server.eventSpawn.rarity["ordinary"] -= value;
  }

  function adjustSpawnGen(prob: number, gen: string) {
    Object.keys(server.eventSpawn.gen).forEach((key) => {
      server.eventSpawn.gen[key as keyof genStat] -= prob;
    });
    server.eventSpawn.gen[gen as keyof genStat] += prob * nbGeneration;
  }

  function adjustSpawnType(prob: number, type: string) {
    Object.keys(server.eventSpawn.type).forEach((key) => {
      server.eventSpawn.type[key as keyof typeStat] -= prob;
    });
    server.eventSpawn.type[type as keyof typeStat] += prob * nbType;
  }

  function addDuration(ms: number) {
    return new Date(date.getTime() + ms);
  }
};
