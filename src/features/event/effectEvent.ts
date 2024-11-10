import EventType from "../../types/EventType";
import ServerType from "../../types/ServerType";
import { defaultValueType, nbGeneration, nbType } from "../../defaultValue";
import getText from "../../lang/language";
import {updateServer} from "../../cache/ServerCache";

interface ProbabilityType {
    [key: number]: number;
}

const DURATIONS = {
    halfHour: 30 * 60 * 1000,
    fifteenMin: 15 * 60 * 1000,
    oneHour: 60 * 60 * 1000,
};

const effectEvent = (event: EventType, server: ServerType): EventType | null => {
    const date = new Date();
    const level = getLevel();

    const eventHandlers: { [key: string]: () => void } = {
        "1": () => handleRarityEvent("legendaire", { 1: 10, 2: 25, 3: 50 }),
        "2": () => setEventTextEffect("nothing", 1),
        "3": () => handleGenerationEvent({ 1: 5, 2: 10, 3: 20 }),
        "4": () => handleRarityEvent("fabuleux", { 1: 2, 2: 5, 3: 10 }),
        "5": () => handleTypeEvent({ 1: 5, 2: 10, 3: 20 }),
        "6": () => handleShinyEvent({ 1: 1.25, 2: 1.5, 3: 2 }),
        "7": () => handleTimeBasedEvent("megaAllow", "auraMega", { 1: DURATIONS.fifteenMin, 2: DURATIONS.halfHour, 3: DURATIONS.oneHour }),
        "8": () => handleMaxMinMessageEvent({ 1: 1, 2: 2, 3: 3 }, { 1: 5, 2: 10, 3: 15 }, "auraEncen"),
        "9": () => handleMaxMinMessageEvent({ 1: 5, 2: 7, 3: 10 }, { 1: 20, 2: 30, 3: 40 }, "auraRepousse"),
        "10": () => handleTimeBasedEvent("setNightMode", "auraNuit", { 1: DURATIONS.fifteenMin, 2: DURATIONS.halfHour, 3: DURATIONS.oneHour }),
        "11": () => handleEggEvent({ 1: 200, 2: 100, 3: 50 }),
    };

    const handler = eventHandlers[event.id];
    if (!handler) return null;

    handler();
    server.eventSpawn.whatEvent = event;
    updateServer(server.id, server);
    return event;

    function setEventTextEffect(eventKey: string, level: number, extraText = '') {
        event.effectDescription = `${getText(server.id, eventKey)}${level}. ${extraText}`;
    }

    function handleRarityEvent(type: string, probabilities: ProbabilityType) {
        updateRarity(type, probabilities[level]);
        server.eventSpawn.endTime = addDuration(DURATIONS.halfHour);
        setEventTextEffect("aura" + capitalize(type), level, getText(server.id, "pendantTrenteMinute"));
    }

    function handleGenerationEvent(probabilities: ProbabilityType) {
        const generation = getRandomGen();
        adjustSpawnGen(probabilities[level], generation);
        server.eventSpawn.endTime = addDuration(DURATIONS.halfHour);
        setEventTextEffect("auraGeneration", level, `${getText(server.id, "ofThisGeneration")}${generation}. ${getText(server.id, "pendantTrenteMinute")}`);
    }

    function handleTypeEvent(probabilities: ProbabilityType) {
        const typeChoice = getRandomType();
        adjustSpawnType(probabilities[level], typeChoice);
        server.eventSpawn.endTime = addDuration(DURATIONS.halfHour);
        setEventTextEffect("auraType", level, `${getText(server.id, "ofThisType")}${getText(server.id, typeChoice)}. ${getText(server.id, "pendantTrenteMinute")}`);
    }

    function handleShinyEvent(probabilities: ProbabilityType) {
        server.eventSpawn.shiny /= probabilities[level];
        server.eventSpawn.endTime = addDuration(DURATIONS.halfHour);
        setEventTextEffect("auraChroma", level, getText(server.id, "pendantTrenteMinute"));
    }

    function handleTimeBasedEvent(action: string, eventKey: string, durations: ProbabilityType) {
        // @ts-ignore
        server.eventSpawn[action] = !server.eventSpawn[action];
        server.eventSpawn.endTime = addDuration(durations[level]);
        setEventTextEffect(eventKey, level, getDurationText(level));
    }

    function handleMaxMinMessageEvent(minProb: ProbabilityType, maxProb: ProbabilityType, eventKey: string) {
        server.eventSpawn.messageSpawn = { min: minProb[level], max: maxProb[level] };
        server.eventSpawn.endTime = addDuration(DURATIONS.halfHour);
        setEventTextEffect(eventKey, level, getText(server.id, "pendantTrenteMinute"));
    }

    function handleEggEvent(probabilities: ProbabilityType) {
        server.eventSpawn.valeurMaxChoiceEgg = probabilities[level];
        server.eventSpawn.endTime = addDuration(DURATIONS.halfHour);
        setEventTextEffect("auraOvale", level, getText(server.id, "pendantTrenteMinute"));
    }

    function addDuration(duration: number) {
        return new Date(date.getTime() + duration);
    }

    function getLevel() {
        const rand = Math.floor(Math.random() * 100);
        return rand >= 99 ? 3 : rand >= 70 ? 2 : 1;
    }

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getDurationText(level: number) {
        return getText(server.id, level === 3 ? "pendantUneHeure" : level === 2 ? "pendantTrenteMinute" : "pendantQuinzeMinute");
    }

    function getRandomGen() {
        return Math.floor(Math.random() * nbGeneration) + 1;
    }

    function getRandomType() {
        const types = Object.keys(defaultValueType);
        return types[Math.floor(Math.random() * types.length)];
    }

    function updateRarity(type: string, probability: number) {
        // @ts-ignore
        server.eventSpawn.rarity[type] = probability;
        server.eventSpawn.rarity["normal"] -= probability;
    }

    function adjustSpawnGen(probability: number, generation: number) {
        // @ts-ignore
        Object.keys(server.eventSpawn.gen).forEach(key => server.eventSpawn.gen[key] -= probability);
        // @ts-ignore
        server.eventSpawn.gen[generation] += probability * nbGeneration;
    }

    function adjustSpawnType(probability: number, type: string) {
        // @ts-ignore
        Object.keys(server.eventSpawn.type).forEach(t => server.eventSpawn.type[t] -= probability);
        // @ts-ignore
        server.eventSpawn.type[type] += probability * nbType;
    }
};

export default effectEvent;
