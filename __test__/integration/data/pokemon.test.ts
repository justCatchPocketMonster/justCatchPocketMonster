import allPokemon from "../../../src/data/pokemon.json";
import {pokemonDb} from "../../../src/core/types/pokemonDb";

import {urlImageRepo} from "../../../src/config/default/misc";
describe('test all data pokemon', () => {
    for (const pokemon of allPokemon) {
        if (pokemon.id === 0) {continue}
        test(`Check pokemon ${pokemon.name.nameEng[0]}`, async () => {
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
            expect(await imageExists(urlImageRepo+"/pokeHome/"+pokemon.imgName+".png")).toBe(true);
            expect(await imageExists(urlImageRepo+"/pokeHome/"+pokemon.imgName+"-shiny.png")).toBe(true);
            expect(await imageExists(urlImageRepo+"/pokeHomeShadow/"+pokemon.imgName+".png")).toBe(true);
            expect(await imageExists(urlImageRepo+"/pokeHomeShadow/"+pokemon.imgName+"-shiny.png")).toBe(true);
        });
    }
});

async function imageExists(url: string): Promise<boolean> {
    const response = await fetch(url, { method: 'HEAD' });
    if(!response.ok){
        console.log(`Image not found: ${url}`);
    }
    return response.ok;
}