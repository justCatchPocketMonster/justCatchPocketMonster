import EventClass from "../../core/types/EventType";
import ServerType from "../../core/types/ServerType";
import { defaultValueType, nbGeneration, nbType } from "../../config/default/defaultValue";
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
const imagePerLvl = ["0012-000", "0012-001", "0012-002"]
const effectEvent = (event: EventClass, server: ServerType): EventClass | null => {
    const date = new Date();
    const level = getLevel();

    console.log(event.id)
    const eventHandlers: { [key: string]: () => void } = {
        "1": () => handleRarityEvent("Legendary", { 1: 10, 2: 25, 3: 50 }),
        "2": () => setEventTextEffect("nothing", 0),
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

    if(server.eventSpawn.whatEvent.id === "9") {
        server.eventSpawn.whatEvent.image = imagePerLvl[level - 1];
    }
    updateServer(server.id, server);
    return event;

    function setEventTextEffect(eventKey: string, level: number, extraText = '') {
        event.effectDescription = `${getText(eventKey, server.language)}${level > 0 ? level : ''}. ${extraText}`;
    }

    function handleRarityEvent(type: string, probabilities: ProbabilityType) {
        updateRarity(type, probabilities[level]);
        server.eventSpawn.endTime = addDuration(DURATIONS.halfHour);
        setEventTextEffect("aura" + capitalize(type), level, getText("pendantTrenteMinute",server.language));
    }

    function handleGenerationEvent(probabilities: ProbabilityType) {
        const generation = getRandomGen();
        adjustSpawnGen(probabilities[level], generation);
        server.eventSpawn.endTime = addDuration(DURATIONS.halfHour);
        setEventTextEffect("auraGeneration", level, `${getText("ofThisGeneration",server.language)}${generation}. ${getText("pendantTrenteMinute",server.language)}`);
    }

    function handleTypeEvent(probabilities: ProbabilityType) {
        const typeChoice = getRandomType();
        adjustSpawnType(probabilities[level], typeChoice);
        server.eventSpawn.endTime = addDuration(DURATIONS.halfHour);
        setEventTextEffect("auraType", level, `${getText("ofThisType",server.language)}${getText(typeChoice,server.language)}. ${getText("pendantTrenteMinute",server.language)}`);
    }

    function handleShinyEvent(probabilities: ProbabilityType) {
        server.eventSpawn.shiny /= probabilities[level];
        server.eventSpawn.endTime = addDuration(DURATIONS.halfHour);
        setEventTextEffect("auraChroma", level, getText("pendantTrenteMinute",server.language));
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

        setEventTextEffect(eventKey, level, getText("pendantTrenteMinute",server.language));
    }

    function handleEggEvent(probabilities: ProbabilityType) {
        server.eventSpawn.valeurMaxChoiceEgg = probabilities[level];
        server.eventSpawn.endTime = addDuration(DURATIONS.halfHour);
        setEventTextEffect("auraOvale", level, getText("pendantTrenteMinute",server.language));
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
        return getText(level === 3 ? "pendantUneHeure" : level === 2 ? "pendantTrenteMinute" : "pendantQuinzeMinute",server.language);
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
        server.eventSpawn.rarity["ordinaire"] -= probability;
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
