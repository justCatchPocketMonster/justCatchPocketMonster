// minimum and max random for pokemon spawn counter
import {defaultRarity} from "./defaultValue";

export const minimumCount = 4+1;
export const maximumCount = 20;

//The IDs of the Pokémon that will not be able to spawn except by transformation
export const pokemonEvent = [132, 570, 571];


export const nbGeneration= 6;
export const valuePerGen={
    "1": 100,
        "2": 100,
        "3": 100,
        "4": 100,
        "5": 100,
        "6": 100,
        "7": 100,
        "8": 100,
        "9": 100
}

export const nbType= 18;
export const valuePerType= {
    "Steel": 100,
        "Dragon": 100,
        "Electric": 100,
        "Fire": 100,
        "Bug": 100,
        "Grass": 100,
        "Psychic": 100,
        "Ground": 100,
        "Dark": 100,
        "Fighting": 100,
        "Water": 100,
        "Fairy": 100,
        "Ice": 100,
        "Normal": 100,
        "Poison": 100,
        "Rock": 100,
        "Ghost": 100,
        "Flying": 100
}

export const valuePerRarity = {
    "ordinary": 990,
    "legendary": 9,
    "Mythical": 1
}
export const maxValueRarity = defaultRarity.ordinaire+defaultRarity.legendaire+defaultRarity.fabuleux;


export const rateMaxShiny = 4096;

export const valueMaxChoiceEgg = 300;

export const valueMaxChoiceEvent = 100;