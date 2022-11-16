const pokedexBDD = require("../bdd/pokemonSpawnFollow.json");
const variableGlobal = require("../parameters/variableGlobal")
var Discord = require('discord.js');
const pokeData = require("../bdd/pokemon.json");
const nbPokemon = (pokeData.length);
const fs = require("fs");
const fonction = require("./fonctionJs")

function addPokemon(pokemon){
    pokemon["date"] = fonction.actualDate();
    pokemon["heure"] = fonction.actualHour();

    pokedexBDD.push(pokemon)
    SaveBdd();
}

function SaveBdd(){
    fs.writeFile("./bdd/pokemonSpawnFollow.json", JSON.stringify(pokedexBDD, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}

module.exports= {addPokemon}