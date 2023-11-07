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

class AllowSpawnChannel {

    static addChannelAllow(idChannel, idServer, channel){

        try{

            this.createServerAllow(idServer)
            let addAllowServer = allowSave[idServer]
            if(allowSave[idServer].indexOf(idChannel) ===-1){
                addAllowServer = addAllowServer.push(idChannel)
                channel.send(language.getText(idServer, "spawnPokemonActivate"))
            } else{
                channel.send(language.getText(idServer, "spawnPokemonAlreadyActivate"))
            }
            
            this.SaveBdd();
        } catch(e) {

            catchError.saveError(idServer, idChannel, "allowSpawnChannel.js", "addChannelAllow", e)
            console.error(e)
        }
    }

    static deleteChannelAllow(idChannel, idServer, channel){

        try{

            this.createServerAllow(idServer)
            let deleteAllowServer = allowSave[idServer]
            if(allowSave[idServer].indexOf(idChannel) !=-1){
                deleteAllowServer.splice(allowSave[idServer].indexOf(idChannel), 1)
                channel.send(language.getText(idServer, "spawnPokemonDesactivate"))
            } else{
                channel.send(language.getText(idServer, "spawnPokemonAlreadyDesactivate"))
            }
            
            this.SaveBdd();
        } catch(e) {

            catchError.saveError(idServer, idChannel, "allowSpawnChannel.js", "deleteChannelAllow", e)
            console.error(e)
        }
    }

    static createServerAllow(idServerCreate){

        try{

            if(allowSave[idServerCreate] === undefined){
                allowSave[idServerCreate] = []
                this.SaveBdd();
            }
            
        } catch(e) {

            catchError.saveError(idServerCreate, null, "allowSpawnChannel.js", "createServerAllow", e)
            console.error(e)
        }
    }

    static idChannelExist(idChannel, idServer){
        
            try{
        
                this.createServerAllow(idServer)
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

    static randomIdServer(idServer, Client){

        try{

            this.createServerAllow(idServer)
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
                        this.SaveBdd();
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

    static SaveBdd(){
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
}

module.exports= AllowSpawnChannel
