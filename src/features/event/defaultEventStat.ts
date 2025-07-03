import EventSpawnClass from "../../core/types/EventSpawnType";
import {
    defaultRarity,
    defaultValueGen,
    defaultValueType,
    formSpecialAllowed, maximumCount, minimumCount
} from "../../config/default/defaultValue";


export default function defaultEventStat(): EventSpawnClass {
    const defaultEventStat: EventSpawnClass = {
        _id: "0",
        gen: {
            ...defaultValueGen
        },
        type: {
            ...defaultValueType
        },
        rarity: {
            ...defaultRarity
        },
        shiny: 0,
        endTime: null,
        whatEvent: null,
        allowedForm: {
            ...formSpecialAllowed
        },
        messageSpawn: {
            "min": minimumCount,
            "max": maximumCount
        },
        nightMode: false,
        valeurMaxChoiceEgg: 0

    }
    return defaultEventStat;
}