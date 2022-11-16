"use strict";

//prefix de toutes les commandes
var prefix = "!"; // minimum et max du random pour le compteur du spawn de pokemon
// Fichier: spawnCount.js

var minimumCount = 0 + 1;
var maximumCount = 5; //pour modifier des stats d'apparition celon le type du pokemon
//valeur maximum pour tombé sur le pokemon

var valeurMaxRandom = 1000;
var valeurMaxOrdinaire = 990;
var valeurMaxLegendaire = 999;
var valeurMaxFabuleux = 1000; //pour modifier des stats d'apparition des event
//valeur maximum pour tombé sur le pokemon

var valeurMaxChoiceEvent = 1000;
var valeurMaxEvent = 10; //Interval entre chaque savegarde des bdd (en milliseconde)

var timeIntervalSave = 86400000; //interval entre chaque changement de status

var timeIntervalStatut = 60000; //version du programme

var version = "1.2.0"; //taux de shiny

var tauxMaxShiny = 4096; //pour modifier des stats d'apparition par génération
//nombre de génération (multiplier par 100)

var nbGeneration = 4; //valeur max par gen

var gen1 = 0;
var gen2 = 0;
var gen3 = 0;
var gen4 = 100;
var gen5 = 500;
var gen6 = 600;
var gen7 = 700;
var gen8 = 800;
var gen9 = 900;
var nbType = 1;
var acier = 0;
var dragon = 0;
var electrik = 100;
var feu = 0;
var insecte = 0;
var plante = 0;
var psy = 0;
var sol = 0;
var tenebres = 0;
var combat = 0;
var eau = 0;
var fee = 0;
var glace = 0;
var normal = 0;
var poison = 0;
var roche = 0;
var spectre = 0;
var vol = 0;
module.exports = {
  vol: vol,
  spectre: spectre,
  roche: roche,
  poison: poison,
  normal: normal,
  glace: glace,
  fee: fee,
  eau: eau,
  combat: combat,
  tenebres: tenebres,
  sol: sol,
  psy: psy,
  plante: plante,
  insecte: insecte,
  feu: feu,
  electrik: electrik,
  dragon: dragon,
  acier: acier,
  nbType: nbType,
  nbGeneration: nbGeneration,
  gen1: gen1,
  gen2: gen2,
  gen3: gen3,
  gen4: gen4,
  gen5: gen5,
  gen6: gen6,
  gen7: gen7,
  gen8: gen8,
  gen9: gen9,
  tauxMaxShiny: tauxMaxShiny,
  valeurMaxEvent: valeurMaxEvent,
  valeurMaxChoiceEvent: valeurMaxChoiceEvent,
  minimumCount: minimumCount,
  maximumCount: maximumCount,
  valeurMaxRandom: valeurMaxRandom,
  valeurMaxOrdinaire: valeurMaxOrdinaire,
  valeurMaxLegendaire: valeurMaxLegendaire,
  timeIntervalSave: timeIntervalSave,
  prefix: prefix,
  timeIntervalStatut: timeIntervalStatut,
  version: version,
  valeurMaxFabuleux: valeurMaxFabuleux
};