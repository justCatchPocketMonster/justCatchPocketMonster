import activeCode from "./activeCode";
import {codeConfig} from "../../config/default/defaultValue";
import codeType from "./codeType";
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
    for(let key in codeConfig.eventCode){
        // @ts-ignore
        code[key] = JSON.parse(JSON.stringify(codeConfig.eventCode[key]));
    }
    const statCatch = 0;
    const statSpawn = 0;

    let palierChoiceSpawn = null;
    let palierChoiceCatch = null;
    codeConfig.paliers.forEach(palier => {
        if (statSpawn >= palier) {
            palierChoiceSpawn = palier;
        }
    });

    codeConfig.paliers.forEach(palier => {
        if (statCatch >= palier) {
            palierChoiceCatch = palier;
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


