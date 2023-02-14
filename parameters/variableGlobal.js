//prefix de toutes les commandes
const prefix = "!";

// minimum et max du random pour le compteur du spawn de pokemon
// Fichier: spawnCount.js

const minimumCount = 0+1;
const maximumCount = 5;

//pour modifier des stats d'apparition celon le type du pokemon
//valeur maximum pour tombé sur le pokemon
const valeurMaxRandom = 1000;
const valeurMaxOrdinaire = 990;
const valeurMaxLegendaire = 9;
const valeurMaxFabuleux = 1

//pour modifier des stats d'apparition des event
//valeur maximum pour tombé sur le pokemon
const valeurMaxChoiceEvent = 1000;
const valeurMaxEvent = 10;

//Interval entre chaque savegarde des bdd (en milliseconde)
const timeIntervalSave= 86400000;
//interval entre chaque changement de status
const timeIntervalStatut = 60000;

//version du programme
const version = "1.3.0"

//taux de shiny
const tauxMaxShiny = 4096;

//pour modifier des stats d'apparition par génération
//nombre de génération (multiplier par 100)
const nbGeneration = 5
//valeur max par gen
const gen1 = 100
const gen2 = 100
const gen3 = 100
const gen4 = 100
const gen5 = 100
const gen6 = 100
const gen7 = 100
const gen8 = 100
const gen9 = 100

//pour modifier des stats d'apparition par type
//nombre de type (multiplier par 100)
const nbType = 18
//valeur max par type
const acier = 100
const dragon = 100
const electrik = 100
const feu = 100
const insecte = 100
const plante = 100
const psy = 100
const sol = 100
const tenebres = 100
const combat = 100
const eau = 100
const fee = 100
const glace = 100
const normal = 100
const poison = 100
const roche = 100
const spectre = 100
const vol = 100

//Les id des pokemon qui pourront de na spawn a part par transformation
const pokemonEvent = [132, 570, 571];



module.exports = {pokemonEvent, vol, spectre, roche, poison, normal, glace, fee, eau, combat, tenebres, sol, psy, plante, insecte, feu, electrik, dragon, acier, nbType, nbGeneration, gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9,tauxMaxShiny, valeurMaxEvent,valeurMaxChoiceEvent,minimumCount, maximumCount, valeurMaxRandom, valeurMaxOrdinaire, valeurMaxLegendaire, timeIntervalSave, prefix, timeIntervalStatut, version, valeurMaxFabuleux}