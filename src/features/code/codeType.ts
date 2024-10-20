import {code} from "./code";

const codeType = (codeEntered): string => {

    for(let key in code){
        if(code[key].includes(codeEntered)){
            return key;
        }
    }
    return null;
}

export default codeType;