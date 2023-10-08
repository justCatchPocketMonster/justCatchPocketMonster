const pokedexBDD = require("../bdd/pokedexSaveServer.json");
const charmeChroma = require("../bdd/charmeChroma.json")
const variableGlobal = require("../parameters/variableGlobal")
var Discord = require('discord.js');
const pokeData = require("../bdd/pokemon.json");
const nbPokemon = pokeData[pokeData.length-1]["id"]
const language = require("../fonction/language")
const fs = require("fs")
const catchError = require("./catchError")
const lockfile = require('lockfile');
const path = require('path');

/**
 * Ajout +1 a l'index du pokemon dans la sauvegarde et créer la sauvegarde si elle n'existe pas et la met a jour si elle ne l'est pas
 * @param {int} idPokemon //id pour l'index
 * @param {string} idServer //id du Server pour la bonne sauvegarde
 */
function pokedex(idPokemon, idServer){
    try {
        if(pokedexBDD[idServer] === undefined){
            createSaveServer(idServer);
        }
        if(pokedexBDD[idServer][nbPokemon] === undefined){
            updateNumberPossibilitySave(idServer);
        }
        pokedexBDD[idServer][idPokemon]+=1;
        SaveBdd();
    } catch(error) {

        catchError.saveError(idServer, null, "pokedexSaveServer.js", "pokedex", error)
        console.error(error)
    }
}

//créer une savuegarde celon l'id de l'Server
function createSaveServer(idServerCreate){
    try {
        if(pokedexBDD[idServerCreate] === undefined){
            pokedexBDD[idServerCreate] = {}
            SaveBdd();
        }
    } catch(error) {

        catchError.saveError(idServerCreate, null, "pokedexSaveServer.js", "createSaveServer", error)
        console.error(error)
    }
    
}

function hasCharmChroma(idServerCreate, message){
    try {
        if(pokedexBDD[idServerCreate] === undefined){
            createSaveServer(idServerCreate);
        }
        if(pokedexBDD[idServerCreate][nbPokemon] === undefined){
            updateNumberPossibilitySave(idServerCreate);
        }
        if(charmeChroma[idServerCreate] === undefined){
            charmeChroma[idServerCreate] = {}
            SaveBddCharmeChroma();
        }
        if(charmeChroma[idServerCreate]["charmeChroma"] === undefined){
            charmeChroma[idServerCreate]["charmeChroma"] = false
            SaveBddCharmeChroma();
        }
    
        for (const [key, value] of Object.entries(pokedexBDD[idServerCreate])) {
    
            if(value === 0){
    
                if(charmeChroma[idServerCreate]["charmeChroma"] === true){
                    message.channel.send(language.getText(message.guild.id, "charmeChromaLose"))
                    charmeChroma[idServerCreate]["charmeChroma"] = false
                    SaveBddCharmeChroma();
                }
                return false
            }
        }
        if(charmeChroma[idServerCreate]["charmeChroma"] === false){
            message.channel.send(language.getText(message.guild.id, "charmeChromaWin"))
            charmeChroma[idServerCreate]["charmeChroma"] = true
            SaveBddCharmeChroma();
        }
        return true
    } catch(error) {

        catchError.saveError(idServerCreate, null, "pokedexSaveServer.js", "hasCharmChroma", error)
        console.error(error)
    }
}

function getSave(idServerCreate){
    try {
        if(pokedexBDD[idServerCreate] === undefined){
            createSaveServer(idServerCreate)
        }
        if(pokedexBDD[idServerCreate][nbPokemon] === undefined){
            updateNumberPossibilitySave(idServerCreate);
        }
        return pokedexBDD[idServerCreate]
    } catch(error) {

        catchError.saveError(idServerCreate, null, "pokedexSaveServer.js", "getSave", error)
        console.error(error)
    }
}
function getCountNational(idServer){
    try {
        countPokemon = 0;
        if(pokedexBDD[idServer] === undefined){
            createSaveServer(idServer)
        }
        if(pokedexBDD[idServer][nbPokemon] === undefined){
            updateNumberPossibilitySave(idServer);
        }
        Object.keys(pokedexBDD[idServer]).forEach(key => {
            if(pokedexBDD[idServer][key] > 0){
                countPokemon ++;
            }
    
        });
        return(countPokemon)
    } catch(error) {

        catchError.saveError(idServer, null, "pokedexSaveServer.js", "getCountNational", error)
        console.error(error)
    }
}

function getPercentageNational(idServer){
    try {
        return(Math.floor((100*getCountNational(idServer))/((pokeData.length)-1)))
    } catch(error) {

        catchError.saveError(idServer, null, "pokedexSaveServer.js", "getPercentageNational", error)
        console.error(error)
    }
}


function getCharmChroma(idServe){
    try {
        return getSave(idServe)
    } catch(error) {

        catchError.saveError(idServe, null, "pokedexSaveServer.js", "getCharmChroma", error)
        console.error(error)
    }
}

//ajoute de nouvelle possibility si des pokemons sont ajoutés dans la bdd
function updateNumberPossibilitySave(idServerUpdate){
    try {
        for(let i = 1; i < nbPokemon; i++){
            if(pokedexBDD[idServerUpdate][i]=== undefined){
                pokedexBDD[idServerUpdate][i] = 0;
            }
        }
        SaveBdd();
        
    } catch(error) {

        catchError.saveError(idServerUpdate, null, "pokedexSaveServer.js", "updateNumberPossibilitySave", error)
        console.error(error)
    }
}
function SaveBdd(){

    const lockfilePath = path.join(__dirname,"..", 'lock', 'pokedexSaveServer.lock');

    

    try{
        lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
            if (err) {
                console.error('Erreur lors du verrouillage du fichier :', err);
                return;
            }
        fs.writeFile(path.join(__dirname,"..", 'bdd', 'pokedexSaveServer.json'), JSON.stringify(pokedexBDD, null, 4), (err)=> {
            if (err)console.log("erreur:", err)

            lockfile.unlock(lockfilePath, (err) => {
                if (err) {
                    console.error('Erreur lors du déverrouillage du fichier :', err);
                }
            });
        });
    });
    } catch(e) {

        catchError.saveError(null, null, "pokedexSaveServer.js", "SaveBdd", e)
        console.error(e)
    }

}
function SaveBddCharmeChroma(){

    const lockfilePath = path.join(__dirname,"..", 'lock', 'charmeChroma.lock');

    


    try{
        lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
            if (err) {
                console.error('Erreur lors du verrouillage du fichier :', err);
                return;
            }
        fs.writeFile(path.join(__dirname,"..", 'bdd', 'charmeChroma.json'), JSON.stringify(charmeChroma, null, 4), (err)=> {
            if (err)console.log("erreur")

            lockfile.unlock(lockfilePath, (err) => {
                if (err) {
                    console.error('Erreur lors du déverrouillage du fichier :', err);
                }
            });
        });
    });
    } catch(e) {

        catchError.saveError(null, null, "pokedexSaveServer.js", "SaveBddCharmeChroma", e)
        console.error(e)
    }

}

module.exports= {getCharmChroma, hasCharmChroma, pokedex, createSaveServer, getSave,getPercentageNational ,getCountNational}