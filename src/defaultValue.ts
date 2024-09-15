//prefix de toutes les commandes
const prefix = "!";

// minimum et max du random pour le compteur du spawn de pokemon
// Fichier: spawnCount.js

const minimumCount = 4+1;
const maximumCount = 20;

//pour modifier des stats d'apparition celon le type du pokemon
//valeur maximum pour tombé sur le pokemon
const defaultRarity = {
    "normal": 990,
    "legendaire": 9,
    "fabuleux": 1
}
const valeurMaxRandom = defaultRarity.normal+defaultRarity.legendaire+defaultRarity.fabuleux;

//pour modifier des stats d'apparition des event
//valeur maximum pour tombé sur le pokemon
const valeurMaxChoiceEvent = 1000;
const valeurMaxEvent = 10;

const valeurMaxChoiceEgg = 300;
const valeurMaxEgg = 1;

//Interval entre chaque savegarde des bdd (en milliseconde)
const timeIntervalSave= 86400000;
//interval entre chaque changement de status
const timeIntervalStatut = 60000;

//version du programme
const version = "1.4.0"

//taux de shiny
const tauxMaxShiny = 4096;

//pour modifier des stats d'apparition par génération
//nombre de génération (multiplier par 100)
const nbGeneration = 6
//valeur max par gen
const defaultValueGen = {
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
const nbType = 18
//valeur max par type
const defaultValueType = {
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

const form = [
    //"alola",
    //"galar",
    //"hisui",
    //"paldea",
    "mega",
    //"giga"
]

//Les id des pokemon qui pourront de na spawn a part par transformation
const pokemonEvent = [132, 570, 571];



export default {pokemonEvent,defaultValueType, nbType, nbGeneration, defaultValueGen,tauxMaxShiny, valeurMaxEvent,valeurMaxChoiceEvent,minimumCount, maximumCount, valeurMaxRandom, defaultRarity, timeIntervalSave, prefix, timeIntervalStatut, version, valeurMaxChoiceEgg, valeurMaxEgg, form}