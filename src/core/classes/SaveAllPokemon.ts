import { SaveAllPokemonType } from "../types/SaveAllPokemonType";
import {SaveOnePokemon} from "./SaveOnePokemon";
import allPokemon from "../../data/pokemon.json";
import {Pokemon} from "./Pokemon";

export interface SortOptions {
    rarity?: string | null;
    form?: string | null;
    useShiny: boolean;
    ascending: boolean;
}

export interface SortedResult {
    maxCount: number;
    who: string[];
}


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
                count += pokemon.normalCount;
            }
        }
        return count;
    }

    addOneCatch(pokemon: Pokemon): void {
        const key = `${pokemon.id}-${pokemon.form}-${pokemon.versionForm}`;
        if (!this.data[key]) {
            this.updateMissSavePokemon();
        }
        this.data[key].normalCount++;
        if (pokemon.isShiny) {
            this.data[key].shinyCount++;
        }
    }

    getSaveWithoutForm(): Record<string, SaveOnePokemon>{
        const result: Record<string, SaveOnePokemon> = {};
        for (const key in this.data) {
            const [id, form, versionForm] = key.split("-");
            if (!result[id]) {
                result[id] = new SaveOnePokemon(
                    id,
                    this.data[key].rarity,
                    "",
                    0,
                    0,
                    0
                );
            }
            result[id].normalCount += this.data[key].normalCount;
            result[id].shinyCount += this.data[key].shinyCount;
        }
        return result;
    }

    static fromMongo(data: SaveAllPokemonType): SaveAllPokemon {
        const saveAllPokemon = new SaveAllPokemon();
        for (const [key, value] of Object.entries(data.data ?? {})) {
            saveAllPokemon.data[key] = new SaveOnePokemon(
                value.idPokemon,
                value.rarity,
                value.form,
                value.versionForm,
                value.shinyCount,
                value.normalCount
            );
        }
        return saveAllPokemon;
    }

    updateMissSavePokemon(): this {
        allPokemon.forEach(pokemon => {
            if (!this.data[pokemon.id+"-"+pokemon.form+"-"+pokemon.versionForm] && pokemon.id !== 0) {
                this.data[pokemon.id+"-"+pokemon.form+"-"+pokemon.versionForm] = new SaveOnePokemon(
                    pokemon.id.toString(),
                    pokemon.rarity,
                    pokemon.form,
                    pokemon.versionForm,
                    0,
                    0
                );
            }
        })
        return this;
    }

    sortPokemonsByCount(options: SortOptions): SortedResult[] {
        const { rarity, form, useShiny, ascending } = options;

        let saveData : Record<string, SaveOnePokemon>

        if(options.form === null || options.form === undefined) {
            saveData = this.getSaveWithoutForm();
        } else {
            saveData = this.data;
        }

        const filtered = Object.values(saveData).filter(pokemon => {
            const matchRarity = rarity == null || pokemon.rarity === rarity;
            const matchForm = form == null || pokemon.form === form;
            return matchRarity && matchForm;
        });

        const aggregated = new Map<string, number>();

        for (const pokemon of filtered) {
            const id = pokemon.idPokemon;
            const count = useShiny ? pokemon.shinyCount : pokemon.normalCount;

            if (aggregated.has(id)) {
                aggregated.set(id, aggregated.get(id)! + count);
            } else {
                aggregated.set(id, count);
            }
        }

        const groupedByCount = new Map<number, Set<string>>();

        for (const [id, count] of aggregated.entries()) {
            if (!groupedByCount.has(count)) {
                groupedByCount.set(count, new Set());
            }
            groupedByCount.get(count)!.add(id);
        }

        const results: SortedResult[] = Array.from(groupedByCount.entries()).map(([count, ids]) => ({
            maxCount: count,
            who: Array.from(ids),
        }));

        results.sort((a, b) => ascending ? a.maxCount - b.maxCount : b.maxCount - a.maxCount);

        return results;
    }




}