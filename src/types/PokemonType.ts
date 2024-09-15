
interface PokemonType {
    id: number;
    name: {
        "nameEng": string;
        "nameFr": string;
    };
    arrayType: string[];
    rarity: string;
    imgName: string[];
    gen: number;
    form: string;
    versionForm: number;

    idChannel: null|string;
}

export default PokemonType;
    