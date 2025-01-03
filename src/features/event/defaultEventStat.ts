import EventSpawnType from "../../types/EventSpawnType";
import {
    defaultRarity,
    defaultValueGen,
    defaultValueType,
    formSpecialAllowed,
    formSpecialValue, maximumCount, minimumCount
} from "../../defaultValue";


export default function defaultEventStat(): EventSpawnType {
    const defaultEventStat: EventSpawnType = {
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

}