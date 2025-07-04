import {SaveOnePokemonType} from '../types/SaveOnePokemonType';

export class SaveOnePokemon implements SaveOnePokemonType {
    constructor(
        public idPokemon: number,
        public form: string,
        public versionForm: number,
        public shinyCount: number,
        public catchCount: number,
    ) {}
}




