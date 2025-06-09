class SaveOnePokemonType {
    _id: string;
    idPokemon: number;
    form: string;
    versionForm: number;
    catch: number;
    shiny: number;


    constructor(_id: string, idPokemon: number, form: string, versionForm: number, catchCount: number, shinyCount: number) {
        this._id = _id;
        this.idPokemon = idPokemon;
        this.form = form;
        this.versionForm = versionForm;
        this.catch = catchCount;
        this.shiny = shinyCount;
    }
}

export default SaveOnePokemonType;