
class PokemonType {
    id: number;
    name: {
        "nameEng": string[];
        "nameFr": string[];
    };
    arrayType: string[];
    rarity: string;
    imgName: string;
    gen: number;
    form: string;
    versionForm: number;
    isShiny: boolean|undefined;
    hint: string;

    idChannel: null|string;
    idServer: null|string;

    constructor(id: number, name: { nameEng: string[]; nameFr: string[] }, arrayType: string[], rarity: string, imgName: string, gen: number, form: string, versionForm: number, isShiny?: boolean, hint?: string, idChannel?: null|string, idServer?: null|string) {
        this.id = id;
        this.name = name;
        this.arrayType = arrayType;
        this.rarity = rarity;
        this.imgName = imgName;
        this.gen = gen;
        this.form = form;
        this.versionForm = versionForm;
        this.isShiny = isShiny || false;
        this.hint = hint || "";
        this.idChannel = idChannel || null;
        this.idServer = idServer || null;
    }
}

export default PokemonType;
    