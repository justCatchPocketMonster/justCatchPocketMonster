import allPokemon from "../../../src/data/pokemon.json";
import {pokemonDb} from "../../../src/core/types/pokemonDb";
import path from "node:path";
import * as fs from "node:fs";
describe('test all data pokemon', () => {
    for (const pokemon of allPokemon) {
        if (pokemon.id === 0) {continue}
        test(`Check pokemon ${pokemon.name.nameEng[0]}`, () => {
            expect(pokemon.id).toBeDefined();
            expect(pokemon.name).toBeDefined();
            expect(pokemon.name.nameEng).toBeDefined();
            expect(pokemon.name.nameFr).toBeDefined();
            expect(pokemon.arrayType).toBeDefined();
            expect(pokemon.rarity).toBeDefined();
            expect(pokemon.gen).toBeDefined();
            expect(pokemon.imgName).toBeDefined();
            expect(pokemon.form).toBeDefined();
            expect(pokemon.versionForm).toBeDefined();

            const pokemonWithSameData: pokemonDb[] = allPokemon.filter(
                p => p.id === pokemon.id && p.form === pokemon.form && p.versionForm === pokemon.versionForm
            );

            expect(pokemonWithSameData.length).toBe(1);

            const imagePath = path.join(__dirname, "../../../src/assets/pokeHome", pokemon.imgName+".png");
            const imageExists = fs.existsSync(imagePath);
            expect(imageExists).toBe(true);
            const imagePathShiny = path.join(__dirname, "../../../src/assets/pokeHome", pokemon.imgName+"-shiny.png");
            const imageExistsShiny = fs.existsSync(imagePathShiny);
            expect(imageExistsShiny).toBe(true);
        });
    }
});