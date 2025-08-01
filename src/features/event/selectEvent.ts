import {EventType} from "../../core/types/EventType";
import eventData from "../../data/eventData.json";
import {ServerType} from "../../core/types/ServerType";
import {updateServer} from "../../cache/ServerCache";
import {capitalizeFirstLetter, deepCloneObject} from "../../utils/helperFunction";
import getText from "../../lang/language";
import {nbGeneration, nbType, valuePerType} from "../../config/default/spawn";
import {genStat, typeStat} from "../../core/types/EventSpawnType";
import {EventSpawn} from "../../core/classes/EventSpawn";

export const selectEvent =async (server: ServerType) => {
  //let randomEvent = eventData[Math.floor(Math.random() * eventData.length)];
  let randomEvent = eventData[10];
  const event : EventType = {
    ...randomEvent,
    id: randomEvent.id.toString(),
    effectDescription: "",
    endTime: new Date(Date.now() + 30 * 1000),
    // TODO: change endTime to a more appropriate value
  }

  const eventSpawn = EventSpawn.createDefault()
  eventSpawn.whatEvent = event;


  effectEvent(eventSpawn, server);
    server.eventSpawn = deepCloneObject(eventSpawn);
  await updateServer(server.discordId, server);
  return;
};


const DURATIONS = {
  fifteenMin: 15 * 60 * 1000,
  halfHour: 30 * 60 * 1000,
  oneHour: 60 * 60 * 1000,
};

const imagePerLvl = ["0012-000", "0012-001", "0012-002"];

const effectEvent = (eventSpawn: EventSpawn, server: ServerType) => {
  const date = new Date();
  const level = getLevel();
  const handlers: Record<string, () => void> = {
    "1": () => handleRarityEvent("legendary", [25, 50, 100]),
    "2": () => setEventTextEffect("nothing", 0),
    "3": () => handleGenerationEvent([5, 10, 20]),
    "4": () => handleRarityEvent("mythical", [2, 5, 10]),
    "5": () => handleTypeEvent([5, 10, 20]),
    "6": () => handleShinyEvent([1.25, 1.5, 2]),
    "7": () => handleFormEvent("mega", "auraMega", [DURATIONS.fifteenMin, DURATIONS.halfHour, DURATIONS.oneHour]),
    "8": () => handleMaxMinMessageEvent([3, 2, 1], [15, 10, 5], "auraEncen"),
    "9": () => handleMaxMinMessageEvent([5, 7, 10], [20, 30, 40], "auraRepousse"),
    "10": () => handleTimeBasedEvent("nightMode", "auraNuit", [DURATIONS.fifteenMin, DURATIONS.halfHour, DURATIONS.oneHour]),
    "11": () => handleEggEvent([200, 100, 50]),
  };

  handlers[eventSpawn.whatEvent!.id]?.();

  if (eventSpawn.whatEvent!.id === "9") {
    eventSpawn.whatEvent!.image = imagePerLvl[level - 1];
  }


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
    eventSpawn.shiny /= values[level - 1];
    applyCommonDuration("auraChroma", DURATIONS.halfHour);
  }

  function handleTimeBasedEvent(flag: string, eventKey: string, durations: number[]) {
    // @ts-ignore
    eventSpawn[flag] = !server.eventSpawn[flag];
    eventSpawn.whatEvent!.endTime = addDuration(durations[level - 1]);
    setEventTextEffect(eventKey, level, getDurationText(level));
  }

  function handleFormEvent(flag: string, eventKey: string, durations: number[]) {
    // @ts-ignore
    eventSpawn.allowedForm[flag] = !eventSpawn.allowedForm[flag];
    eventSpawn.whatEvent!.endTime = addDuration(durations[level - 1]);
    setEventTextEffect(eventKey, level, getDurationText(level));
  }

  function handleMaxMinMessageEvent(min: number[], max: number[], key: string) {
    eventSpawn.messageSpawn = { min: min[level - 1], max: max[level - 1] };
    applyCommonDuration(key, DURATIONS.halfHour);
  }

  function handleEggEvent(values: number[]) {
    eventSpawn.valueMaxChoiceEgg = values[level - 1];
    applyCommonDuration("auraOvale", DURATIONS.halfHour);
  }

  // --- Helpers ---

  function applyCommonDuration(key: string, duration: number, extra: string = "") {
    eventSpawn.whatEvent!.endTime = addDuration(duration);
    setEventTextEffect(key, level, extra + getText("pendantTrenteMinute", server.language));
  }

  function setEventTextEffect(key: string, lvl: number, extra: string = "") {
    eventSpawn.whatEvent!.effectDescription = `${getText(key, server.language)}${lvl > 0 ? lvl : ""}. ${extra}`;
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
    eventSpawn.rarity[type] = value;
    eventSpawn.rarity["ordinary"] -= value;
  }

  function adjustSpawnGen(prob: number, gen: string) {
    Object.keys(eventSpawn.gen).forEach((key) => {
      eventSpawn.gen[key as keyof genStat] -= prob;
    });
    eventSpawn.gen[gen as keyof genStat] += prob * nbGeneration;
  }

  function adjustSpawnType(prob: number, type: string) {
    Object.keys(eventSpawn.type).forEach((key) => {
      eventSpawn.type[key as keyof typeStat] -= prob;
    });
    eventSpawn.type[type as keyof typeStat] += prob * nbType;
  }

  function addDuration(ms: number) {
    return new Date(date.getTime() + ms);
  }
};
