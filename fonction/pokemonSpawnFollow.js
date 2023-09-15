const pokedexBDD = require("../bdd/pokemonSpawnFollow.json");
const variableGlobal = require("../parameters/variableGlobal")
var Discord = require('discord.js');
const pokeData = require("../bdd/pokemon.json");
const nbPokemon = (pokeData.length);
const fs = require("fs");
const fonction = require("./fonctionJs")
const catchError = require("./catchError")
const lockfile = require('lockfile');
const path = require('path');

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
    const lockfilePath = path.join(__dirname,"..", 'lock', 'pokemonSpawnFollow.lock');

    

    try{
        lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
            if (err) {
                console.error('Erreur lors du verrouillage du fichier :', err);
                return;
            }
        fs.writeFile(path.join(__dirname,"..", 'bdd', 'pokemonSpawnFollow.json'), JSON.stringify(pokedexBDD, null, 4), (err)=> {
            if (err)console.log("erreur")

            lockfile.unlock(lockfilePath, (err) => {
                if (err) {
                    console.error('Erreur lors du déverrouillage du fichier :', err);
                }
            });
        });
    });
    } catch(e) {

        catchError.saveError(null, null, "pokemonSpawnFollow.js", "SaveBdd", e)
        console.error(e)
    }

}

module.exports= {addPokemon}