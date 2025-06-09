
interface PokemonType {
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
}

export default PokemonType;
    