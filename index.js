const variableGlobal = require("./parameters/variableGlobal")
const Discord = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const fileConnexion = require("./fonction/connexion");
const filePokemon = require("./fonction/pokemonController.js")
const pokedexSaveUser = require("./fonction/pokedexSaveUser")
const pokedexSaveServer = require("./fonction/pokedexSaveServer")
const serverAllow = require("./fonction/allowSpawnChannel");
const justDiscord = require("./fonction/justeDiscord")
const spawnCount = require("./fonction/spawnCount")
const language = require("./fonction/language")
const codeEntered = require("./fonction/code")
const saveAllBdd = require("./fonction/createSave")
const catchError = require("./fonction/catchError")

var Client = new Discord.Client({ 
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});
const prefix = variableGlobal.prefix;

fileConnexion.connexion(Discord, Client);

var repeteSave = setInterval(saveAllBdd.createCopyAllBdd, variableGlobal.timeIntervalSave)
try{
    /**
     * a l'envoie d'un message
     */
    Client.on("messageCreate", message => {
        if(message.author.bot) return;

        

        if(message.content === prefix + "spawn"){
            if(message.member.permissions.has("ADMINISTRATOR")){
                serverAllow.addChannelAllow(message.channel.id, message.guild.id, message)
            } else {
                message.channel.send(language.getText(message.guild.id, "noAutorisation"))
            }
            return
        }

        

        if(message.content === prefix + "unspawn"){
            if(message.member.permissions.has("ADMINISTRATOR")){
                serverAllow.deleteChannelAllow(message.channel.id, message.guild.id, message)
            } else {
                message.channel.send(language.getText(message.guild.id, "noAutorisation"))
            }
            return
        }
        
        if(message.content.substring(0,(prefix+"code ").length) === prefix + "code "){
            
            codeEntered.enterCode(message.member.id, message.content.substring((prefix+"code ").length), message)
            
            return
        }

        if(message.content.substring(0,(prefix+"lang ").length) === prefix + "lang "){
            if(message.member.permissions.has("ADMINISTRATOR")){
                language.setLanguage(message.guild.id, message.content.substring((prefix+"lang ").length), message)
            } else {
                message.channel.send(language.getText(message.guild.id, "noAutorisation"))
            }
            return
        }

        if(message.content === prefix +"pokedex"){
            filePokemon.embedPokemonSaveUser(Discord, message, Client, 1);
            return
        }

        if(message.content.substring(0,(prefix+"pokedex ").length) === prefix + "pokedex "){
            filePokemon.embedPokemonSaveUser(Discord, message, Client, message.content.substring((prefix+"pokedex ").length));
            return
        }

        if(message.content === prefix + "help"){
            justDiscord.embedHelp(Discord, message); 
            return
        }
        
        if(message.content === prefix + "mention"){
            justDiscord.embedMention(Discord, message); 
            return
        }
        /*
        if(message.content === prefix + "creator"){
            justDiscord.embedCreateur(Discord, message); 
            return
        }
        */
        if(serverAllow.randomIdServer(message.guild.id) != undefined){
            filePokemon.spawnPokemon(Discord, message, Client)
            return
        }
    });


    /**
     * au rajout du bot créer une sauvegarde serveur
     */
    Client.on("guildCreate", guild =>{
        pokedexSaveServer.createSaveServer(guild.id)
        serverAllow.createServerAllow(guild.id)
        spawnCount.createCount(guild.id)
    })

    const data = new SlashCommandBuilder()
        .setName("quoi")
        .setDescription("bas c'est un test")
        
        .addStringOption(option => option.setName("utilisateur").setDescription("Utilisateur que vous souhaitez mentionner").setRequired(false))
        

    Client.on("interactionCreate", interaction => {
        if(interaction.isCommand()){
            if(interaction.commandName === "quoi"){
                let pokemon = interaction.options.getString("utilisateur")

                if(pokemon != undefined){

                }
                interaction.reply("feur" + pokemon)
            }
        }
    })


    Client.on("ready", () => {
        
        Client.guilds.cache.get("972893923359998053").commands.fetch()
            .then(commands => {
                commands.map(command => {
                    command.delete();
                })
            })

        setInterval(justDiscord.randomStatus, variableGlobal.timeIntervalStatut, Client)
        Client.user.setStatus("online")

        //application au general
        //Client.application.commands.create(data)


        //Client.guilds.cache.get("972893923359998053").commands.create(data)
        //console.log(Client.guilds.cache.get("972893923359998053").commands.cache)
        
        
            


    });



    

}catch (error){
    catchError.saveError(message.guild.id, error)
    console.log(error)
}
