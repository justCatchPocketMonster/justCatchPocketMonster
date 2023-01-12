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
const createCommand = require("./fonction/commandCreate")
const bddText = require("./bdd/languageText.json")
const pagination = require("./fonction/pagination")
const stat = require("./fonction/stat")


var Client = new Discord.Client({ 

    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.MessageContent
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


        
        if(message.content === prefix + "mention"){
            justDiscord.embedMention(Discord, message); 
            return
        }

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


    Client.on("interactionCreate", interaction => {
        if(interaction.isCommand()){
            if(interaction.commandName === "spawn"){
                var channel
                if(interaction.options.getChannel(bddText.spawnNameOptionChannel.Eng[0]) != null){
                    
                    channel = interaction.options.getChannel(bddText.spawnNameOptionChannel.Eng[0]);

                }else {
                    channel = interaction.channel;
                }


                if(interaction.options.getBoolean(bddText.spawnNameOptionBool.Eng[0])){
                    serverAllow.addChannelAllow(channel.id, interaction.guild.id, interaction.channel)
                }else {
                    serverAllow.deleteChannelAllow(channel.id, interaction.guild.id, interaction.channel)
                }
            }

            if(interaction.commandName == "code"){
                codeEntered.enterCode(interaction.member.id, interaction.options.getString(bddText.codeNameOptionString.Eng[0]), interaction)
                
                
            }

            if(interaction.commandName == bddText.commandLangName.Eng[0]){
                language.setLanguage(interaction.guild.id, interaction.options.getString(bddText.langNameOptionString.Eng[0]), interaction)
                
            }

            if(interaction.commandName == "catch"){

                filePokemon.catchPokemon(Discord, interaction, Client, interaction.options.getString(bddText.commandCatchOptionName.Eng[0]))
            }

            
            if(interaction.commandName == "pokedex"){

                if(interaction.options.getString(bddText.pokedexNameOptionStringPage.Eng[0]) != null){
                    filePokemon.embedPokemonSaveUser(Discord, interaction, Client, interaction.options.getString(bddText.pokedexNameOptionStringPage.Eng[0]))
                } else {
                    filePokemon.embedPokemonSaveUser(Discord, interaction, Client, 1);
                }


            }
            if(interaction.commandName == "how"){
                
                if(interaction.options.getString(bddText.commandHowOptionNameStringNumber.Eng[0]) !== null){

                    //numero du pokemon
                    filePokemon.howThisPokemon(Discord, interaction, false, interaction.options.getString(bddText.commandHowOptionNameStringNumber.Eng[0]))

                } else if(interaction.options.getString(bddText.commandHowOptionNameStringPokemonName.Eng[0]) !== null){

                    //nom du poke
                    filePokemon.howThisPokemon(Discord, interaction, interaction.options.getString(bddText.commandHowOptionNameStringPokemonName.Eng[0]), false)

                } else {
                    
                    filePokemon.howThisPokemon(Discord, interaction, false, false)

                }

                
                //filePokemon.howThisPokemon(Discord, interaction, Client)


            }

            if(interaction.commandName == "stat"){
                
                stat.embedStat(interaction)

            }



            interaction.reply({
                content: `.`,
            });
            setTimeout(() => {
                interaction.deleteReply();
            }, 1000)

        
        }
    })


    Client.on("ready", () => {
        
        setInterval(justDiscord.randomStatus, variableGlobal.timeIntervalStatut, Client)
        Client.user.setStatus("online")

        pagination.resetAtZero()


        Client.guilds.cache.get("972893923359998053").commands.create(createCommand.spawnCommand)
        Client.guilds.cache.get("972893923359998053").commands.create(createCommand.codeCommand)
        Client.guilds.cache.get("972893923359998053").commands.create(createCommand.langCommand)
        Client.guilds.cache.get("972893923359998053").commands.create(createCommand.pokedexCommand)
        Client.guilds.cache.get("972893923359998053").commands.create(createCommand.howHaveThisPokemonCommand)
        Client.guilds.cache.get("972893923359998053").commands.create(createCommand.catchCommand)
        Client.guilds.cache.get("972893923359998053").commands.create(createCommand.allStatCommand)
        //application au general
        //Client.application.commands.create(data)

        //Client.guilds.cache.get("972893923359998053").commands.
        //console.log(Client.guilds.cache.get("972893923359998053").commands.cache)
        
    });
    



    

}catch (error){
    catchError.saveError(message.guild.id, error)
    console.log(error)
}
