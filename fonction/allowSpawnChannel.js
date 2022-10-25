const variableGlobal = require("../parameters/variableGlobal")
const allowSave = require("../bdd/serversAllowThisChannel.json");
const language = require("./language")
var Discord = require('discord.js');
var fonction = require("./fonctionJs")
const fs = require("fs")


function addChannelAllow(idChannel, idServer, message){
    createServerAllow(idServer)
    addAllowServer = allowSave[idServer]
    if(allowSave[idServer].indexOf(idChannel) ===-1){
        addAllowServer = addAllowServer.push(idChannel)
        message.channel.send(language.getText(idServer, "spawnPokemonActivate"))
    } else{
        message.channel.send(language.getText(idServer, "spawnPokemonAlreadyActivate"))
    }
    
    SaveBdd();
}

function deleteChannelAllow(idChannel, idServer, message){
    createServerAllow(idServer)
    deleteAllowServer = allowSave[idServer]
    if(allowSave[idServer].indexOf(idChannel) !=-1){
        deleteAllowServer.splice(allowSave[idServer].indexOf(idChannel), 1)
        message.channel.send(language.getText(idServer, "spawnPokemonDesactivate"))
    } else{
        message.channel.send(language.getText(idServer, "spawnPokemonAlreadyDesactivate"))
    }
    
    SaveBdd();
}

//créer une sauvegarde des autorisation celon l'id de l'Server
function createServerAllow(idServerCreate){
    if(allowSave[idServerCreate] === undefined){
        allowSave[idServerCreate] = []
        SaveBdd();
    }
    
}

/**
 *ressort un salon aléatoirement ou undefined si inexistant
 */
function randomIdServer(idServer){
    createServerAllow(idServer)
    if(allowSave[idServer][0] === undefined){
        return undefined
    } else {
        var nbChannelAllow = allowSave[idServer].length
        var randomWithCount = fonction.getRandomInt(nbChannelAllow);
        return allowSave[idServer][randomWithCount]
    }
    
}


function SaveBdd(){
    fs.writeFile("./bdd/serversAllowThisChannel.json", JSON.stringify(allowSave, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}

module.exports= {addChannelAllow, createServerAllow, deleteChannelAllow, randomIdServer}