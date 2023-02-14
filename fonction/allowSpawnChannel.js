const variableGlobal = require("../parameters/variableGlobal")
const allowSave = require("../bdd/serversAllowThisChannel.json");
const language = require("./language")
var Discord = require('discord.js');
var fonction = require("./fonctionJs")
const fs = require("fs");
const { channel } = require("diagnostics_channel");
const catchError = require("./catchError")


function addChannelAllow(idChannel, idServer, channel){

    try{

        createServerAllow(idServer)
        addAllowServer = allowSave[idServer]
        if(allowSave[idServer].indexOf(idChannel) ===-1){
            addAllowServer = addAllowServer.push(idChannel)
            channel.send(language.getText(idServer, "spawnPokemonActivate"))
        } else{
            channel.send(language.getText(idServer, "spawnPokemonAlreadyActivate"))
        }
        
        SaveBdd();
    } catch(e) {

        catchError.saveError(idServer, idChannel, "allowSpawnChannel.js", "addChannelAllow", e)
        console.error(e)
    }
}

function deleteChannelAllow(idChannel, idServer, channel){

    try{

        createServerAllow(idServer)
        deleteAllowServer = allowSave[idServer]
        if(allowSave[idServer].indexOf(idChannel) !=-1){
            deleteAllowServer.splice(allowSave[idServer].indexOf(idChannel), 1)
            channel.send(language.getText(idServer, "spawnPokemonDesactivate"))
        } else{
            channel.send(language.getText(idServer, "spawnPokemonAlreadyDesactivate"))
        }
        
        SaveBdd();
    } catch(e) {

        catchError.saveError(idServer, idChannel, "allowSpawnChannel.js", "deleteChannelAllow", e)
        console.error(e)
    }
}

//créer une sauvegarde des autorisation celon l'id de l'Server
function createServerAllow(idServerCreate){

    try{

        if(allowSave[idServerCreate] === undefined){
            allowSave[idServerCreate] = []
            SaveBdd();
        }
        
    } catch(e) {

        catchError.saveError(idServerCreate, null, "allowSpawnChannel.js", "createServerAllow", e)
        console.error(e)
    }
}

/**
 *ressort un salon aléatoirement ou undefined si inexistant
 */
function randomIdServer(idServer){

    try{

        createServerAllow(idServer)
        if(allowSave[idServer][0] === undefined){
            return undefined
        } else {
            var nbChannelAllow = allowSave[idServer].length
            var randomWithCount = fonction.getRandomInt(nbChannelAllow);
            return allowSave[idServer][randomWithCount]
        }

    } catch(e) {

        catchError.saveError(idServer, null, "allowSpawnChannel.js", "randomIdServer", e)
        console.error(e)
    }
    
}


function SaveBdd(){

    try{

        fs.writeFile("./bdd/serversAllowThisChannel.json", JSON.stringify(allowSave, null, 4), (err)=> {
            if (err)console.log("erreur")
        })
    } catch(e) {

        catchError.saveError(null, null, "allowSpawnChannel.js", "SaveBdd", e)
        console.error(e)
    }
}

module.exports= {addChannelAllow, createServerAllow, deleteChannelAllow, randomIdServer}