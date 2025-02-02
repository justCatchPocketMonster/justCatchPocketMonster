function cleanNameHint(nameHint: string[]): string[] {
    return nameHint.filter(element => element !== "\\");
}

function generateInitialHint(namePokemon: string, realName: string): string[] {
    if (namePokemon !== realName) {
        return namePokemon.split("");
    }
    return namePokemon.replace(/[a-zA-Z0-9]/g, "_").split("");
}

function revealRandomLetter(hintArray: string[], realNameArray: string[], namePokemon: string, realName: string): string[] {
    let letterReveal = Math.floor(Math.random() * realNameArray.length);
    while (hintArray[letterReveal] === realNameArray[letterReveal] && namePokemon !== realName) {
        letterReveal = Math.floor(Math.random() * realNameArray.length);
    }
    hintArray[letterReveal] = realNameArray[letterReveal];
    return hintArray;
}

function formatHintWithSlashes(hintArray: string[]): string {
    let emplacementLetter = 0;
    let finalHint: string[] = [];

    hintArray.forEach(element => {
        if (element === "_" && emplacementLetter !== 0) {
            finalHint.push("\\");
        }
        if (element === "_" && emplacementLetter === 0) {
            emplacementLetter++;
        }
        finalHint.push(element);
    });

    return finalHint.join("");
}

export default function createHint(namePokemon: string, realName: string, isAlreadyHint: boolean): string {
    if (isAlreadyHint && namePokemon === realName) {
        return namePokemon;
    }

    let nameHint = generateInitialHint(namePokemon, realName);
    let nameChange = realName.split("");
    let cleanedHint = cleanNameHint(nameHint);
    let modifiedHint = revealRandomLetter(cleanedHint, nameChange, namePokemon, realName);
    return formatHintWithSlashes(modifiedHint);
}


