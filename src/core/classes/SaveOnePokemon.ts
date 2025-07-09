import {SaveOnePokemonType} from '../types/SaveOnePokemonType';

export class SaveOnePokemon implements SaveOnePokemonType {
    constructor(
        public idPokemon: string,
        public rarity: string,
        public form: string,
        public versionForm: number,
        public shinyCount: number,
        public normalCount: number,
    ) {}
}




