const statBdd = require("../bdd/stat.json")
const pokeData = require("../bdd/pokemon.json");
const variableGlobal = require("../parameters/variableGlobal")
const nbPokemon = (pokeData.length);
var version = variableGlobal.version;
const fs = require("fs")


/**
 * Ajout +1 a l'index du pokemon dans la sauvegarde et créer la sauvegarde si elle n'existe pas et la met a jour si elle ne l'est pas
 * @param {int} idPokemon //id pour l'index
 */
 function statAddSpawn(idPokemon, isShiny){

    createStatVersion()

    if(statBdd[version]["listPokemonSpawned"][nbPokemon] === undefined){
        updateNumberPossibilitySpawned();
    }

    statBdd[version]["pokemonSpawned"]+=1;
    statBdd["All"]["pokemonSpawned"]+=1;
    statBdd[version]["listPokemonSpawned"][idPokemon]+=1;
    statBdd["All"]["listPokemonSpawned"][idPokemon]+=1;
    if(isShiny){
        statBdd[version]["pokemonSpawnedShiny"]+=1;
        statBdd["All"]["pokemonSpawnedShiny"]+=1;
        statBdd[version]["listPokemonSpawnedShiny"][idPokemon]+=1;
        statBdd["All"]["listPokemonSpawnedShiny"][idPokemon]+=1;
    }
    SaveBdd();
}

/**
 * Ajout +1 a l'index du pokemon dans la sauvegarde et créer la sauvegarde si elle n'existe pas et la met a jour si elle ne l'est pas
 * @param {int} idPokemon //id pour l'index
 */
 function statAddCatch(idPokemon, isShiny){

    createStatVersion()


    if(statBdd[version]["listPokemonCatched"][nbPokemon] === undefined){
        updateNumberPossibilityCatched();
    }
    statBdd[version]["pokemonCatched"]+=1;
    statBdd["All"]["pokemonCatched"]+=1;
    statBdd[version]["listPokemonCatched"][idPokemon]+=1;
    statBdd["All"]["listPokemonCatched"][idPokemon]+=1;
    if(isShiny){
        statBdd[version]["pokemonCatchedShiny"]+=1;
        statBdd["All"]["pokemonCatchedShiny"]+=1;
        statBdd[version]["listPokemonCatchedShiny"][idPokemon]+=1;
        statBdd["All"]["listPokemonCatchedShiny"][idPokemon]+=1;
    }
    SaveBdd();
}


function createStatVersion(){

    if(statBdd["All"] === undefined){
        statBdd["All"]= {};
    }
    if(statBdd["All"]["pokemonSpawned"] === undefined){
        statBdd["All"]["pokemonSpawned"] = 0;
    }
    if(statBdd["All"]["pokemonCatched"] === undefined){
        statBdd["All"]["pokemonCatched"] = 0;
    }
    if(statBdd["All"]["pokemonSpawnedShiny"] === undefined){
        statBdd["All"]["pokemonSpawnedShiny"] = 0;
    }
    if(statBdd["All"]["pokemonCatchedShiny"] === undefined){
        statBdd["All"]["pokemonCatchedShiny"] = 0;
    }
    if(statBdd["All"]["listPokemonSpawned"] === undefined){
        statBdd["All"]["listPokemonSpawned"] = {};
    }
    if(statBdd["All"]["listPokemonCatched"] === undefined){
        statBdd["All"]["listPokemonCatched"] = {};
    }
    if(statBdd["All"]["listPokemonSpawnedShiny"] === undefined){
        statBdd["All"]["listPokemonSpawnedShiny"] = {};
    }
    if(statBdd["All"]["listPokemonCatchedShiny"] === undefined){
        statBdd["All"]["listPokemonCatchedShiny"] = {};
    }
    if(statBdd[version] === undefined){
        statBdd[version]= {};
    }
    if(statBdd[version]["pokemonSpawned"] === undefined){
        statBdd[version]["pokemonSpawned"] = 0;
    }
    if(statBdd[version]["pokemonCatched"] === undefined){
        statBdd[version]["pokemonCatched"] = 0;
    }
    if(statBdd[version]["pokemonSpawnedShiny"] === undefined){
        statBdd[version]["pokemonSpawnedShiny"] = 0;
    }
    if(statBdd[version]["pokemonCatchedShiny"] === undefined){
        statBdd[version]["pokemonCatchedShiny"] = 0;
    }
    if(statBdd[version]["listPokemonSpawned"] === undefined){
        statBdd[version]["listPokemonSpawned"] = {};
    }
    if(statBdd[version]["listPokemonCatched"] === undefined){
        statBdd[version]["listPokemonCatched"] = {};
    }
    if(statBdd[version]["listPokemonSpawnedShiny"] === undefined){
        statBdd[version]["listPokemonSpawnedShiny"] = {};
    }
    if(statBdd[version]["listPokemonCatchedShiny"] === undefined){
        statBdd[version]["listPokemonCatchedShiny"] = {};
    }




    SaveBdd();
}


function updateNumberPossibilitySpawned(){
    for(let i = 1; i < nbPokemon; i++){
        if(statBdd["All"]["listPokemonSpawned"][i]=== undefined){
            statBdd["All"]["listPokemonSpawned"][i] = 0;
        } else {
            statBdd["All"]["listPokemonSpawned"][i] = statBdd["All"]["listPokemonSpawned"][i];
        }
        if(statBdd["All"]["listPokemonSpawnedShiny"][i]=== undefined){
            statBdd["All"]["listPokemonSpawnedShiny"][i] = 0;
        } else {
            statBdd["All"]["listPokemonSpawnedShiny"][i] = statBdd["All"]["listPokemonSpawnedShiny"][i];
        }
        if(statBdd[version]["listPokemonSpawned"][i]=== undefined){
            statBdd[version]["listPokemonSpawned"][i] = 0;
        } else {
            statBdd[version]["listPokemonSpawned"][i] = statBdd[version]["listPokemonSpawned"][i];
        }
        
        if(statBdd[version]["listPokemonSpawnedShiny"][i]=== undefined){
            statBdd[version]["listPokemonSpawnedShiny"][i] = 0;
        } else {
            statBdd[version]["listPokemonSpawnedShiny"][i] = statBdd[version]["listPokemonSpawnedShiny"][i];
        }
        
    }
    SaveBdd();
    
}

function updateNumberPossibilityCatched(){
    for(let i = 1; i < nbPokemon; i++){
        if(statBdd["All"]["listPokemonCatched"][i]=== undefined){
            statBdd["All"]["listPokemonCatched"][i] = 0;
        }else {
            statBdd["All"]["listPokemonCatched"][i] = statBdd["All"]["listPokemonCatched"][i];
        }
        if(statBdd["All"]["listPokemonCatchedShiny"][i]=== undefined){
            statBdd["All"]["listPokemonCatchedShiny"][i] = 0;
        }else {
            statBdd["All"]["listPokemonCatchedShiny"][i] = statBdd["All"]["listPokemonCatchedShiny"][i];
        }
        if(statBdd[version]["listPokemonCatched"][i]=== undefined){
            statBdd[version]["listPokemonCatched"][i] = 0;
        }else {
            statBdd[version]["listPokemonCatched"][i] = statBdd[version]["listPokemonCatched"][i];
        }
        
        if(statBdd[version]["listPokemonCatchedShiny"][i]=== undefined){
            statBdd[version]["listPokemonCatchedShiny"][i] = 0;
        }else {
            statBdd[version]["listPokemonCatchedShiny"][i] = statBdd[version]["listPokemonCatchedShiny"][i];
        }
        
    }
    SaveBdd();
    
}

function getCountAllCatch(){
    return statBdd["All"]["pokemonCatched"]
}
function getCountAllSpawn(){
    return statBdd["All"]["pokemonSpawned"]
}
function getCountAllCatchShiny(){
    return statBdd["All"]["pokemonCatchedShiny"]
}
function getCountAllSpawnShiny(){
    return statBdd["All"]["pokemonSpawnedShiny"]
}
function getCountAllCatchList(){
    return statBdd["All"]["listPokemonCatched"]
}
function getCountAllSpawnList(){
    return statBdd["All"]["listPokemonSpawned"]
}
function getCountAllCatchShinyList(){
    return statBdd["All"]["listPokemonCatchedShiny"]
}
function getCountAllSpawnShinyList(){
    return statBdd["All"]["listPokemonSpawnedShiny"]
}


function SaveBdd(){
    fs.writeFile("./bdd/stat.json", JSON.stringify(statBdd, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}

module.exports = {statAddCatch, statAddSpawn, getCountAllCatch, getCountAllSpawn, version, getCountAllCatchShiny,getCountAllSpawnShiny, getCountAllCatchList, getCountAllSpawnList, getCountAllCatchShinyList, getCountAllSpawnShinyList}