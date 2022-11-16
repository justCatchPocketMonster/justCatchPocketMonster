"use strict";

var pokedexBDD = require("../bdd/pokemonSpawnFollow.json");

var variableGlobal = require("../parameters/variableGlobal");

var Discord = require('discord.js');

var pokeData = require("../bdd/pokemon.json");

var nbPokemon = pokeData.length;

var fs = require("fs");

var fonction = require("./fonctionJs");

function addPokemon(pokemon) {
  pokemon["date"] = fonction.actualDate();
  pokemon["heure"] = fonction.actualHour();
  pokedexBDD.push(pokemon);
  SaveBdd();
}

function SaveBdd() {
  fs.writeFile("./bdd/pokemonSpawnFollow.json", JSON.stringify(pokedexBDD, null, 4), function (err) {
    if (err) console.log("erreur");
  });
}

module.exports = {
  addPokemon: addPokemon
};