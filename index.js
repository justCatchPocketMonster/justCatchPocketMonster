const variableGlobal = require("./parameters/variableGlobal")
const Discord = require('discord.js');
const fileConnexion = require("./fonction/connexion");
const filePokemon = require("./fonction/pokemonController.js")
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
const eventStatChange = require("./fonction/eventStatChange")
const eventChoice = require("./fonction/eventChoice")


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

function waitOneSecond(){
    setInterval(() =>{
        eventStatChange.time();
        
    }, 1000)

    //setInterval(() =>{
        codeEntered.codeIsOutdated();
    //}, 1000 * 60 * 10)
}



/**
 * a l'envoie d'un message
 */
Client.on("messageCreate", message => {

    try{

        if(message.author.bot) return;


        if(serverAllow.randomIdServer(message.guild.id) != undefined){

            filePokemon.spawnPokemon(Discord, message, Client)
            return
        }
    } catch(error) {

        catchError.saveError(message.guild.id, message.channel.id, "index.js", "messageCreate", error)
        console.error(error)
    }
});


/**
 * au rajout du bot créer une sauvegarde serveur
 */
Client.on("guildCreate", guild =>{

    try{


        pokedexSaveServer.createSaveServer(guild.id)
        serverAllow.createServerAllow(guild.id)
        spawnCount.createCount(guild.id)
    } catch(e) {

        catchError.saveError(guild.id, null, "index.js", "guildCreate", e)
        console.error(e)
    }
})

/**
 * quand une interaction est lancé
 */
Client.on("interactionCreate", interaction => {
		 try{

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
            if(interaction.commandName == "howmuch"){
                
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
            if(interaction.commandName == "currentminievent"){
                
                eventChoice.eventCommandEmbed(interaction, interaction.guild.id)

            }



            
            if(interaction.commandName == "test"){
                testAllPokemon.listAllPokemon(Discord, interaction, Client, interaction.channel.id)
            }




            interaction.reply({
                content: `.`,
            });
            setTimeout(() => {
                interaction.deleteReply();
            }, 1000)

        
        }
    } catch(e) {

        catchError.saveError(interaction.guild.id, interaction.channel.id, "index.js", "interactionCreate", e)
        console.error(e)
    }
})

Client.on('disconnect', () => {
    const channelId = "994614918483546152";
  const channel = Client.channels.cache.get(channelId);
  if (channel) {
    channel.send('Je suis en train de m\'éteindre...');
  } else {
    console.log(`Impossible de trouver le salon avec l'ID ${channelId}`);
  }

});
process.on('SIGINT', function() {
  client.destroy()
    .then(() => {
      console.log('Déconnexion réussie');
      process.exit(0);
    })
    .catch(console.error);
});

/**
 * quand le bot est prêt
 */
Client.on("ready", () => {

    try{
        
        setInterval(justDiscord.randomStatus, variableGlobal.timeIntervalStatut, Client)
        Client.user.setStatus("online");

        setTimeout(waitOneSecond, 10000)

        pagination.resetAtZero()


        Client.application.commands.create(createCommand.spawnCommand)
        Client.application.commands.create(createCommand.codeCommand)
        Client.application.commands.create(createCommand.langCommand)
        Client.application.commands.create(createCommand.pokedexCommand)
        Client.application.commands.create(createCommand.howHaveThisPokemonCommand)
        Client.application.commands.create(createCommand.catchCommand)
        Client.application.commands.create(createCommand.allStatCommand)
        Client.application.commands.create(createCommand.effectCommand)
        
    } catch(e) {

        catchError.saveError(null, null, "index.js", "interactionCreate", e)
        console.error(e)
    }

    
});
    

