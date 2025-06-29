import PokemonClass from "../../core/types/PokemonType";
import {defaultRarity, defaultValueType, hidePokemon, nbGeneration} from "../../defaultValue"
import ServerType from "../../core/types/ServerType";
import pokemonType from "../../core/types/PokemonType";
import serverType from "../../core/types/ServerType";
import allPokemon from '../../data/pokemon.json';
import checkTimeForResetEventStat from "../event/checkTimeForResetEventStat";



const selectPokemon  = (server: ServerType , idPokemon : number = 0, isEgg: boolean = false) : PokemonClass => {
    checkTimeForResetEventStat(server.id)
    let pokemonChoiced: PokemonClass;

    const allowedPokemon : pokemonType[] = megaIsAllowed(server, allPokemon as pokemonType[]);
    if(idPokemon === 0){
        pokemonChoiced = selectRandomPokemon(server, allowedPokemon);
        pokemonChoiced = isHiddenPokemon(server, pokemonChoiced);
    } else {
        pokemonChoiced = selectPokemonWithId(idPokemon);
    }

    pokemonChoiced.isShiny = shinySelect(pokemonChoiced.id, server, isEgg);

    return pokemonChoiced
}

export default selectPokemon;

function shinySelect(idPokemon: number, server:serverType, isEgg: boolean): boolean{
    let tauxShiny = 4096;
    let saveServer = server.savePokemon.find(save => save.idPokemon === idPokemon)?.catch;

    if(saveServer === undefined){
        saveServer = 0;
    }

    if(isEgg){
        tauxShiny /= 2;
    }

    if(saveServer >= 100){
        tauxShiny /= 2;
    } else if(saveServer >= 75){
        tauxShiny /= 1.80;
    }else if(saveServer >= 50){
        tauxShiny /= 1.60;
    }else if(saveServer >= 30){
        tauxShiny /= 1.40;
    }else if(saveServer >= 20){
        tauxShiny /= 1.30;
    }else if(saveServer >= 10){
        tauxShiny /= 1.20;
    }else if(saveServer >= 5){
        tauxShiny /= 1.15;
    }else if(saveServer >= 3){
        tauxShiny /= 1.10;
    }

    let nbRandomShiny:number = Math.floor(Math.random() * tauxShiny);
    return nbRandomShiny === 1
}

function isHiddenPokemon(server: ServerType, pokemon: PokemonClass): PokemonClass {

    let randomNumber : number = Math.floor(Math.random() * hidePokemon.maxValue);

    if(randomNumber == 1){
        const allPokemonWithId = allPokemon.filter(pokemon => hidePokemon.idPokemon.includes(pokemon.id));
        const choicePokemon = allPokemonWithId[Math.floor(Math.random() * allPokemonWithId.length)];

        pokemon.id = choicePokemon.id;
        pokemon.arrayType.push(...choicePokemon.arrayType);
    }

    return pokemon;
}

function megaIsAllowed(server: ServerType, allowedPokemon: PokemonClass[]): PokemonClass[]{
    if(server.eventSpawn.allowedForm.mega){
        return allowedPokemon;
    } else {
        return allowedPokemon.filter(pokemon => pokemon.form !== "mega");
    }
}

function selectPokemonWithId(idPokemon: number): PokemonClass {
    const allPokemonWithId = allPokemon.filter(pokemon => pokemon.id === idPokemon);

    return {
        ...allPokemonWithId[Math.floor(Math.random() * allPokemonWithId.length)],
        idChannel: null,
        idServer: null,
        isShiny: false,
        hint: ""
    };
}
function selectRandomPokemon(server: ServerType, allowedPokemon : PokemonClass[]): PokemonClass {
    let pokemonPassGen : PokemonClass[]
    let generation : string
    do{
        generation = generationSelect(server)
        pokemonPassGen = allowedPokemon.filter(pokemon => pokemon.gen === Number(generation))
    }while(pokemonPassGen[0] === undefined)

    let pokemonPassRarity : PokemonClass[]
    let rarity : string
    do{
        rarity = raritySelect(server)
        pokemonPassRarity = pokemonPassGen.filter(pokemon => pokemon.rarity === rarity)
    }while(pokemonPassRarity[0] === undefined)

    let pokemonPassType : PokemonClass[]
    let type : string
    do{
        type = typeSelect(server)
        pokemonPassType = pokemonPassGen.filter(pokemon => pokemon.arrayType.includes(type))
    }while(pokemonPassType[0] === undefined)

    return {
        ...pokemonPassType[Math.floor(Math.random() * pokemonPassType.length)],
        idChannel: null,
        idServer: null,
        isShiny: false,
        hint: ""
    }
}

function generationSelect(server: ServerType): string {
    const randomNumber = Math.floor(Math.random() * (nbGeneration*100));
    let somStatByGen = 0;

    for (let gen = 1; gen <= 9; gen++) {
        // @ts-ignore
        somStatByGen += server.eventSpawn.gen[gen];
        if (randomNumber <= somStatByGen) {
            return gen.toString();
        }
    }
    return "";
}

function raritySelect(server: ServerType): string {
    const randomNumber = Math.floor(Math.random() * 100);
    let somStatByRarity = 0;

    let arrayRarity : string[] = Object.keys(defaultRarity);
    for (let i = 0; i < arrayRarity.length; i++) {
        // @ts-ignore
        somStatByRarity += server.eventSpawn.rarity[arrayRarity[i]];
        if (randomNumber <= somStatByRarity) {
            return arrayRarity[i];
        }
    }

    return "";
}

function typeSelect(server: ServerType): string {
    const randomNumber = Math.floor(Math.random() * Object.values(defaultValueType).reduce((a, b) => a + b, 0));
    let somStatByType = 0;

    let arrayType : string[] = Object.keys(defaultValueType);

    for (let i = 0; i < arrayType.length; i++) {
        // @ts-ignore
        somStatByType += server.eventSpawn.type[arrayType[i]];
        if (randomNumber <= somStatByType) {
            return arrayType[i];
        }
    }

    return "";
}