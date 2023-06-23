const variableGlobal = require("../parameters/variableGlobal")
const bddCount = require("../bdd/countPokemon.json")
const fonction = require("../fonction/fonctionJs")
const minimumCount = variableGlobal.minimumCount;
const maxmumCount = variableGlobal.maximumCount;
var random = 0;
const fs = require("fs")
const catchError = require("./catchError")
const lockfile = require('lockfile');
const path = require('path');



//Créer une avancer 
function createCount(idServer, idChannel){
    try {
        if(bddCount[idServer] === undefined){
            bddCount[idServer] = {"nbCountMax" : maxmumCount, "nbCountActuel" : 0, "pokemonPresentActuel": {}}
        }
    
        SaveBdd();
    } catch(error) {

        catchError.saveError(idServer, idChannel, "spawnCount.js", "createCount", error)
        console.error(error)
    }
}


function getPokemonPresent(idServer, idChannel){
    try {
        verifPresenceCount(idServer, idChannel)
        return bddCount[idServer]["pokemonPresentActuel"][idChannel]
    } catch(error) {

        catchError.saveError(idServer, idChannel, "spawnCount.js", "getPokemonPresent", error)
        console.error(error)
    }
}
function getMaxRandom(idServer, idChannel){
   try {
     verifPresenceCount(idServer, idChannel)
     return bddCount[idServer]["nbCountMax"]
   } catch (error) {
    
   }
}
function getCount(idServer, idChannel){
    try {
        verifPresenceCount(idServer, idChannel)
        return bddCount[idServer]["nbCountActuel"]
    } catch(error) {

        catchError.saveError(idServer, idChannel, "spawnCount.js", "getMaxRandom", error)
        console.error(error)
    }
}

function setPokemonPresent(idServer, value, idChannel){
    try {
        verifPresenceCount(idServer, idChannel)
        bddCount[idServer]["pokemonPresentActuel"][idChannel] = value;
        SaveBdd();
    } catch(error) {

        catchError.saveError(idServer, idChannel, "spawnCount.js", "setPokemonPresent", error)
        console.error(error)
    }
}
function setMaxRandom(idServer, idChannel){
    try {
        verifPresenceCount(idServer, idChannel)
        do{
            random = fonction.getRandomInt(maxmumCount);
        }while(!(random>minimumCount))
        bddCount[idServer]["nbCountMax"] = random;
        SaveBdd();
    } catch(error) {

        catchError.saveError(idServer, idChannel, "spawnCount.js", "setMaxRandom", error)
        console.error(error)
    }
}
function setCount(idServer, value, idChannel){
    try {
        verifPresenceCount(idServer, idChannel)
        bddCount[idServer]["nbCountActuel"] = value;
        SaveBdd();
    } catch(error) {

        catchError.saveError(idServer, idChannel, "spawnCount.js", "setCount", error)
        console.error(error)
    }
}

function verifPresenceCount(idServer, idChannel){
    try {
        if(bddCount[idServer]===undefined){
            createCount(idServer, idChannel)
            
        }
    } catch(error) {

        catchError.saveError(idServer, idChannel, "spawnCount.js", "verifPresenceCount", error)
        console.error(error)
    }
}


function SaveBdd(){

    const lockfilePath = path.join(__dirname,"..", 'lock', 'countPokemon.lock');

    

    try{
        lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
            if (err) {
                console.error('Erreur lors du verrouillage du fichier :', err);
                return;
            }
        fs.writeFile(path.join(__dirname,"..", 'bdd', 'countPokemon.json'), JSON.stringify(bddCount, null, 4), (err)=> {
            if (err)console.log("erreur")

            lockfile.unlock(lockfilePath, (err) => {
                if (err) {
                    console.error('Erreur lors du déverrouillage du fichier :', err);
                }
            });
        });
    });
    } catch(e) {

        catchError.saveError(null, null, "spawnCount.js", "SaveBdd", e)
        console.error(e)
    }

}

module.exports = {createCount, getPokemonPresent, getCount,getMaxRandom, setCount, setMaxRandom, setPokemonPresent}
