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
const valeurMaxLegendaire = 999;
const valeurMaxFabuleux = 1000

//pour modifier des stats d'apparition des event
//valeur maximum pour tombé sur le pokemon
const valeurMaxChoiceEvent = 1000;
const valeurMaxEvent = 10;

//Interval entre chaque savegarde des bdd (en milliseconde)
const timeIntervalSave= 86400000;
//interval entre chaque changement de status
const timeIntervalStatut = 60000;

//version du programme
const version = "1.2.0"

//taux de shiny
const tauxMaxShiny = 4096;

//pour modifier des stats d'apparition par génération
//nombre de génération (multiplier par 100)
const nbGeneration = 4
//valeur max par gen
const gen1 = 0
const gen2 = 0
const gen3 = 0
const gen4 = 100
const gen5 = 500
const gen6 = 600
const gen7 = 700
const gen8 = 800
const gen9 = 900


const nbType = 1

const acier = 0
const dragon = 0
const electrik = 100
const feu = 0
const insecte = 0
const plante = 0
const psy = 0
const sol = 0
const tenebres = 0
const combat = 0
const eau = 0
const fee = 0
const glace = 0
const normal = 0
const poison = 0
const roche = 0
const spectre = 0
const vol = 0




module.exports = {vol, spectre, roche, poison, normal, glace, fee, eau, combat, tenebres, sol, psy, plante, insecte, feu, electrik, dragon, acier, nbType, nbGeneration, gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9,tauxMaxShiny, valeurMaxEvent,valeurMaxChoiceEvent,minimumCount, maximumCount, valeurMaxRandom, valeurMaxOrdinaire, valeurMaxLegendaire, timeIntervalSave, prefix, timeIntervalStatut, version, valeurMaxFabuleux}