import activeCode from "./activeCode";
import codeType from "./codeType";
import {eventCode, landings} from "../../config/default/code";
let code: { [key: string]: string[] } = {
    "shiny": []
};


export function getCode(){
    return code;
}

export function setCode(newCode: typeof code){
    code = newCode;
}

export function updateArrayCode(){
    let code = getCode();
    for(let key in eventCode){
        // @ts-ignore
        code[key] = JSON.parse(JSON.stringify(codeConfig.eventCode[key]));
    }
    const statCatch = 0;
    const statSpawn = 0;

    let palierChoiceSpawn = null;
    let palierChoiceCatch = null;
    landings.forEach(landing => {
        if (statSpawn >= landing) {
            palierChoiceSpawn = landing;
        }
    });

    landings.forEach(landing => {
        if (statCatch >= landing) {
            palierChoiceCatch = landing;
        }
    });

    if (palierChoiceSpawn) {
        code.shiny.push("SPAWNS"+palierChoiceSpawn);
    }
    if (palierChoiceCatch) {
        code.shiny.push("CATCHS"+palierChoiceCatch);
    }
    console.log(code)
    setCode(code);
}

export {
    activeCode,
    code,
    codeType
}


