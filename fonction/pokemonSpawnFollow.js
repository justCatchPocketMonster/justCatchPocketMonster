const pokedexBDD = require("../bdd/pokemonSpawnFollow.json");
const variableGlobal = require("../parameters/variableGlobal")
var Discord = require('discord.js');
const pokeData = require("../bdd/pokemon.json");
const nbPokemon = (pokeData.length);
const fs = require("fs");
const fonction = require("./fonctionJs")
const catchError = require("./catchError")

function addPokemon(pokemon){
    try {
        pokemon["date"] = fonction.actualDate();
        pokemon["heure"] = fonction.actualHour();
    
        pokedexBDD.push(pokemon)
        SaveBdd();
    } catch(error) {

        catchError.saveError(null, null, "pokemonSpawnFollow.js", "addPokemon", error)
        console.error(error)
    }
}

function SaveBdd(){
    try {
        fs.writeFile("./bdd/pokemonSpawnFollow.json", JSON.stringify(pokedexBDD, null, 4), (err)=> {
            if (err)console.log("erreur")
        })
    } catch(error) {

        catchError.saveError(null, null, "pokemonSpawnFollow.js", "SaveBdd", error)
        console.error(error)
    }
}

module.exports= {addPokemon}