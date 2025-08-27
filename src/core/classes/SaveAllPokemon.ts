import { SaveAllPokemonType } from "../types/SaveAllPokemonType";
import { SaveOnePokemon } from "./SaveOnePokemon";
import allPokemon from "../../data/pokemon.json";
import { Pokemon } from "./Pokemon";

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

export class SaveAllPokemon implements SaveAllPokemonType {
  data: Record<string, SaveOnePokemon>;
  constructor(data: Record<string, SaveOnePokemon> = {}) {
    this.data = data;
  }

  getCatchByOnlyId(id: string): number {
    let count = 0;
    for (const key in this.data) {
      const pokemon = this.data[key];
      if (pokemon.idPokemon === id) {
        count += pokemon.normalCount;
      }
    }
    return count;
  }

  getThisSaveUniqueId(): SaveAllPokemon {
    const uniqueData: Record<string, SaveOnePokemon> = {};
    for (const key in this.data) {
      const pokemon = this.data[key];
      if (!uniqueData[pokemon.idPokemon]) {
        uniqueData[pokemon.idPokemon] = new SaveOnePokemon(
          pokemon.idPokemon,
          pokemon.rarity,
          "form",
          0,
          0,
          0,
        );
      }
      uniqueData[pokemon.idPokemon].normalCount += pokemon.normalCount;
      uniqueData[pokemon.idPokemon].shinyCount += pokemon.shinyCount;
    }
    return new SaveAllPokemon(uniqueData);
  }

  getSaveOnePokemonFusedForm(idPokemon: string): SaveOnePokemon {
    let pokemonSave = new SaveOnePokemon(idPokemon, "fused", "fused", 0, 0, 0);
    for (const key in this.data) {
      const pokemon = this.data[key];
      if (pokemon.idPokemon === idPokemon) {
        pokemonSave.normalCount += pokemon.normalCount;
        pokemonSave.shinyCount += pokemon.shinyCount;
      }
    }
    return pokemonSave;
  }

  getAllSaveOfOnePokemon(idPokemon: string): SaveOnePokemon[] {
    const saves: SaveOnePokemon[] = [];
    for (const key in this.data) {
      const pokemon = this.data[key];
      if (pokemon.idPokemon === idPokemon) {
        saves.push(pokemon);
      }
    }
    return saves;
  }

  getThisSaveUniqueIdWithByIdRange(
    minId: number = 1,
    maxId: number = allPokemon[allPokemon.length - 1]["id"],
  ): SaveAllPokemon {
    const uniqueData: Record<string, SaveOnePokemon> = {};
    for (const key in this.data) {
      const pokemon = this.data[key];
      if (
        Number(pokemon.idPokemon) <= minId ||
        Number(pokemon.idPokemon) >= maxId
      )
        continue;
      if (!uniqueData[pokemon.idPokemon]) {
        uniqueData[pokemon.idPokemon] = new SaveOnePokemon(
          pokemon.idPokemon,
          pokemon.rarity,
          "form",
          0,
          0,
          0,
        );
      }
      uniqueData[pokemon.idPokemon].normalCount += pokemon.normalCount;
      uniqueData[pokemon.idPokemon].shinyCount += pokemon.shinyCount;
    }
    return new SaveAllPokemon(uniqueData);
  }

  addOneCatch(pokemon: Pokemon): void {
    const key = `${pokemon.id}-${pokemon.form}-${pokemon.versionForm}`;

    if (!this.data[key]) {
      throw new Error(`Pokemon non référencé : ${key}`);
    }

    this.data[key].normalCount++;
    if (pokemon.isShiny) {
      this.data[key].shinyCount++;
    }
  }

  getSavesById(id: string): SaveOnePokemon[] {
    return Object.values(this.data).filter(
      (pokemon) => pokemon.idPokemon === id,
    );
  }

  countUniquePokemonsCaught(): number {
    const uniquePokemons = new Set<string>();
    for (const key in this.data) {
      const pokemon = this.data[key];
      if (pokemon.normalCount > 0 && !uniquePokemons.has(pokemon.idPokemon)) {
        uniquePokemons.add(pokemon.idPokemon);
      }
    }
    return uniquePokemons.size;
  }

  countUniquePokemonsShinyCaught(): number {
    const uniquePokemons = new Set<string>();
    for (const key in this.data) {
      const pokemon = this.data[key];
      if (pokemon.shinyCount > 0 && !uniquePokemons.has(pokemon.idPokemon)) {
        uniquePokemons.add(pokemon.idPokemon);
      }
    }
    return uniquePokemons.size;
  }

  static fromMongo(data: SaveAllPokemonType): SaveAllPokemon {
    const saveAllPokemon = new SaveAllPokemon();
    saveAllPokemon.initMissingPokemons();
    for (const [key, value] of Object.entries(data.data ?? {})) {
      saveAllPokemon.data[key] = new SaveOnePokemon(
        value.idPokemon,
        value.rarity,
        value.form,
        value.versionForm,
        value.shinyCount,
        value.normalCount,
      );
    }
    return saveAllPokemon;
  }

  initMissingPokemons() {
    allPokemon.forEach((pokemon) => {
      if (
        !this.data[
          pokemon.id + "-" + pokemon.form + "-" + pokemon.versionForm
        ] &&
        pokemon.id !== 0
      ) {
        this.data[pokemon.id + "-" + pokemon.form + "-" + pokemon.versionForm] =
          new SaveOnePokemon(
            pokemon.id.toString(),
            pokemon.rarity,
            pokemon.form,
            pokemon.versionForm,
            0,
            0,
          );
      }
    });
  }

  sortPokemonsByCount(options: SortOptions): SortedResult[] {
    const { rarity, form, useShiny, ascending } = options;

    const filtered = Object.values(this.data).filter((pokemon) => {
      const matchRarity = rarity == undefined || pokemon.rarity === rarity;
      const matchForm = form == undefined || pokemon.form === form;
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

    const results: SortedResult[] = Array.from(groupedByCount.entries()).map(
      ([count, ids]) => ({
        maxCount: count,
        who: Array.from(ids),
      }),
    );

    results.sort((a, b) =>
      ascending ? a.maxCount - b.maxCount : b.maxCount - a.maxCount,
    );

    return results;
  }
}
