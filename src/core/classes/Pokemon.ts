import {PokemonType} from '../types/PokemonType';

export class Pokemon implements PokemonType {
    constructor(
        public id: string,
        public name: {
            nameEng: string[];
            nameFr: string[];
        },
        public arrayType: string[],
        public rarity: string,
        public imgName: string,
        public gen: number,
        public form: string,
        public versionForm: number,
        public isShiny: boolean | undefined,
        public hint: string,
        public idChannel: string | null,
        public idServer: string | null
    ) {}
}
