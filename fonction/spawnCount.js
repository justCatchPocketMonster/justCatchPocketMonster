const variableGlobal = require("../parameters/variableGlobal")
const bddCount = require("../bdd/countPokemon.json")
const fonction = require("../fonction/fonctionJs")
const minimumCount = variableGlobal.minimumCount;
const maxmumCount = variableGlobal.maximumCount;
var random = 0;
const fs = require("fs")



//Créer une avancer 
function createCount(idServer, idChannel){
    if(bddCount[idServer] === undefined){
        bddCount[idServer] = {"nbCountMax" : maxmumCount, "nbCountActuel" : 0, "pokemonPresentActuel": {}}
    }

    SaveBdd();
}


function getPokemonPresent(idServer, idChannel){
    verifPresenceCount(idServer, idChannel)
    return bddCount[idServer]["pokemonPresentActuel"][idChannel]
}
function getMaxRandom(idServer, idChannel){
    verifPresenceCount(idServer, idChannel)
    return bddCount[idServer]["nbCountMax"]
}
function getCount(idServer, idChannel){
    verifPresenceCount(idServer, idChannel)
    return bddCount[idServer]["nbCountActuel"]
}

function setPokemonPresent(idServer, value, idChannel){
    verifPresenceCount(idServer, idChannel)
    bddCount[idServer]["pokemonPresentActuel"][idChannel] = value;
    SaveBdd();
}
function setMaxRandom(idServer, idChannel){
    verifPresenceCount(idServer, idChannel)
    do{
        random = fonction.getRandomInt(maxmumCount);
    }while(!(random>minimumCount))
    bddCount[idServer]["nbCountMax"] = random;
    SaveBdd();
}
function setCount(idServer, value, idChannel){
    verifPresenceCount(idServer, idChannel)
    bddCount[idServer]["nbCountActuel"] = value;
    SaveBdd();
}

function verifPresenceCount(idServer, idChannel){
    if(bddCount[idServer]===undefined){
        createCount(idServer, idChannel)
        
    }
}


function SaveBdd(){
    fs.writeFile("./bdd/countPokemon.json", JSON.stringify(bddCount, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}

module.exports = {createCount, getPokemonPresent, getCount,getMaxRandom, setCount, setMaxRandom, setPokemonPresent}
