import { SaveAllPokemonType } from "../types/SaveAllPokemonType";
import {SaveOnePokemon} from "./SaveOnePokemon";
import allPokemon from "../../data/pokemon.json";

export class SaveAllPokemon implements SaveAllPokemonType{

    data: Record<string, SaveOnePokemon>;
    constructor(data:Record<string, SaveOnePokemon> = {}) {
        this.data = data;
    }

    getCatchByOnlyId(id: String): number {
        let count = 0;
        for (const key in this.data) {
            const pokemon = this.data[key];
            if (pokemon.idPokemon === id) {
                count += pokemon.catchCount;
            }
        }
        return count;
    }

    static fromMongo(data: SaveAllPokemonType): SaveAllPokemon {
        const saveAllPokemon = new SaveAllPokemon();
        for (const [key, value] of Object.entries(data.data ?? {})) {
            saveAllPokemon.data[key] = new SaveOnePokemon(
                value.idPokemon,
                value.form,
                value.versionForm,
                value.shinyCount,
                value.catchCount
            );
        }
        return saveAllPokemon;
    }

    updateMissSavePokemon(): this {
        allPokemon.forEach(pokemon => {
            if (!this.data[pokemon.id+"-"+pokemon.form+"-"+pokemon.versionForm] && pokemon.id !== 0) {
                this.data[pokemon.id+"-"+pokemon.form+"-"+pokemon.versionForm] = new SaveOnePokemon(
                    pokemon.id.toString(),
                    pokemon.form,
                    pokemon.versionForm,
                    0,
                    0
                );
            }
        })
        return this;
    }
}