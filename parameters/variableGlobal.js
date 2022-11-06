//prefix de toutes les commandes
const prefix = "!";

// minimum et max du random pour le compteur du spawn de pokemon
// Fichier: spawnCount.js

const minimumCount = 0+5;
const maximumCount = 20;

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
const gen1 = 100
const gen2 = 200
const gen3 = 300
const gen4 = 400
const gen5 = 500
const gen6 = 600
const gen7 = 700
const gen8 = 800
const gen9 = 900


const nbType = 18

const acier = 100
const dragon = 200
const electrik = 300
const feu = 400
const insecte = 500
const plante = 600
const psy = 700
const sol = 800
const tenebres = 900
const combat = 1000
const eau = 1100
const fee = 1200
const glace = 1300
const normal = 1400
const poison = 1500
const roche = 1600
const spectre = 1700
const vol = 1800




module.exports = {vol, spectre, roche, poison, normal, glace, fee, eau, combat, tenebres, sol, psy, plante, insecte, feu, electrik, dragon, acier, nbType, nbGeneration, gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9,tauxMaxShiny, valeurMaxEvent,valeurMaxChoiceEvent,minimumCount, maximumCount, valeurMaxRandom, valeurMaxOrdinaire, valeurMaxLegendaire, timeIntervalSave, prefix, timeIntervalStatut, version, valeurMaxFabuleux}