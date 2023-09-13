const variableGlobal = require("../parameters/variableGlobal")
const allowSave = require("../bdd/serversAllowThisChannel.json");
const language = require("./language")
var Discord = require('discord.js');
var fonction = require("./fonctionJs")
const fs = require("fs");
const { channel } = require("diagnostics_channel");
const catchError = require("./catchError")
const lockfile = require('lockfile');
const path = require('path');


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

function idChannelExist(idChannel, idServer){
    
        try{
    
            createServerAllow(idServer)
            if(allowSave[idServer].indexOf(idChannel) ===-1){
                return false
            } else{
                return true
            }
            
        } catch(e) {
    
            catchError.saveError(idServer, idChannel, "allowSpawnChannel.js", "idChannelExist", e)
            console.error(e)
        }
}

/**
 *ressort un salon aléatoirement ou undefined si inexistant
 */
function randomIdServer(idServer, Client){

    try{

        createServerAllow(idServer)
        if(allowSave[idServer][0] === undefined){
            return undefined
        } else {
            var nbChannelAllow
            server = Client.guilds.cache.get(idServer);
            botMember = server.members.cache.get(Client.user.id);
            const permissionRequiredSendMessage = "SendMessages";
            const permissionRequiredViewChannel = "ViewChannel";
            let channelValid = false;

            do{

                nbChannelAllow = allowSave[idServer].length
                var randomWithCount = fonction.getRandomInt(nbChannelAllow);

                canSendMessage = botMember.permissionsIn(Client.channels.cache.get(allowSave[idServer][randomWithCount])).has(permissionRequiredSendMessage);
                canViewChannel = botMember.permissionsIn(Client.channels.cache.get(allowSave[idServer][randomWithCount])).has(permissionRequiredViewChannel);

                canGiveResponse = (canViewChannel && canSendMessage)

                if(canGiveResponse === false){
                    allowSave[idServer].splice(randomWithCount, 1)
                    SaveBdd();
                    channelNotValid = false;
                } else {
                    channelNotValid = true;
                }

            } while( !(channelNotValid === true || allowSave[idServer].length === 0));
            return allowSave[idServer][randomWithCount]
        }

    } catch(e) {

        catchError.saveError(idServer, null, "allowSpawnChannel.js", "randomIdServer", e)
        console.error(e)
    }
    
}

function SaveBdd(){
    const lockfilePath = path.join(__dirname,"..", 'lock', 'serversAllowThisChannel.lock');

    

    try{
        lockfile.lock(lockfilePath, {"retries": 1000, "retryWait": 100}, (err) => {
            if (err) {
                console.error('Erreur lors du verrouillage du fichier :', err);
                return;
            }
        fs.writeFile(path.join(__dirname,"..", 'bdd', 'serversAllowThisChannel.json'), JSON.stringify(allowSave, null, 4), (err)=> {
            if (err)console.log("erreur")

            lockfile.unlock(lockfilePath, (err) => {
                if (err) {
                    console.error('Erreur lors du déverrouillage du fichier :', err);
                }
            });
        });
    });
    } catch(e) {

        catchError.saveError(null, null, "allowSpawnChannel.js", "SaveBdd", e)
        console.error(e)
    }
}

module.exports= {idChannelExist, addChannelAllow, createServerAllow, deleteChannelAllow, randomIdServer}