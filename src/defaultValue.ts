
// minimum et max du random pour le compteur du spawn de pokemon
// Fichier: spawnCount.js

export const minimumCount = 4+1;
export const maximumCount = 20;

//pour modifier des stats d'apparition celon le type du pokemon
//valeur maximum pour tombé sur le pokemon
export const defaultRarity = {
    "normal": 990,
    "legendaire": 9,
    "fabuleux": 1
}
export const valeurMaxRandom = defaultRarity.normal+defaultRarity.legendaire+defaultRarity.fabuleux;

//pour modifier des stats d'apparition des event
//valeur maximum pour tombé sur le pokemon
export const valeurMaxChoiceEvent = 1000;
export const valeurMaxEvent = 10;

export const valeurMaxChoiceEgg = 300;
export const valeurMaxEgg = 1;

//Interval entre chaque savegarde des bdd (en milliseconde)
export const timeIntervalSave= 86400000;
//interval entre chaque changement de status
export const timeIntervalStatut = 60000;

//version du programme
export const version = "1.4.0"

//taux de shiny
export const tauxMaxShiny = 4096;

//pour modifier des stats d'apparition par génération
//nombre de génération (multiplier par 100)
export const nbGeneration = 6
//valeur max par gen
export const defaultValueGen = {
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

//pour modifier des stats d'apparition par type
//nombre de type (multiplier par 100)
export const nbType = 18
//valeur max par type
export const defaultValueType = {
    "acier": 100,
    "dragon": 100,
    "electrik": 100,
    "feu": 100,
    "insecte": 100,
    "plante": 100,
    "psy": 100,
    "sol": 100,
    "tenebres": 100,
    "combat": 100,
    "eau": 100,
    "fee": 100,
    "glace": 100,
    "normal": 100,
    "poison": 100,
    "roche": 100,
    "spectre": 100,
    "vol": 100
}


//TODO: a voir la gestion des forms
export const formRegionValue = {
    "alola": 70,
    "galar": 70,
    "hisui": 70,
    "paldea": 70
}

export const formSpecialValue = {
    "mega": 0,
    "giga": 0
}

export const hidePokemon = {
    "idPokemon": [132, 570, 571],
    "maxValue": 100
}

//Les id des pokemon qui pourront de na spawn a part par transformation
export const pokemonEvent = [132, 570, 571];

export const codeConfig = {
    paliers : [5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 2500000, 3000000],
    eventCode: {
        shiny: [""]
    }

}
