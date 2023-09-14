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
const pokeDataAll = require("./bdd/pokemon.json");
const fs = require("fs");
const path = require('path');


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

    setInterval(() =>{
        codeEntered.codeIsOutdated();
    }, 1000 * 60 * 10)

    setInterval(() =>{
        spawnCount.updateHint();
    }, 1000 * 60 * 1)
}



/**
 * a l'envoie d'un message
 */
Client.on("messageCreate", message => {

    try{

        if(message.author.bot) return;


        if(serverAllow.randomIdServer(message.guild.id, Client) != undefined){

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

    const permissionRequiredSendMessage = "SendMessages";
    const permissionRequiredViewChannel = "ViewChannel";

    server = interaction.guild;
    botMember = server.members.cache.get(Client.user.id);
    
    canSendMessage = botMember.permissionsIn(interaction.channel).has(permissionRequiredSendMessage);
    canViewChannel = botMember.permissionsIn(interaction.channel).has(permissionRequiredViewChannel);

    canGiveResponse = (canViewChannel && canSendMessage)
        if(interaction.isCommand()){

            if(canGiveResponse){
                
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
                    
                    stat.embedStatGeneral(interaction)

                }
                if(interaction.commandName == "currentminievent"){
                    
                    eventChoice.eventCommandEmbed(interaction, interaction.guild.id)

                }



                
                if(interaction.commandName == "test"){
                    testAllPokemon.listAllPokemon(Discord, interaction, Client, interaction.channel.id)
                }

                if(interaction.commandName == "hint"){
                    if(interaction.options.getChannel("channel") != null){
                        channel = interaction.options.getChannel("channel");
                    }else {
                        channel = interaction.channel;
                    }

                    idChannel = channel.id;

                    hint = (spawnCount.getHint(interaction.guild.id, idChannel));
                    
                    if(hint == undefined){
                        interaction.channel.send(language.getText(interaction.guild.id, "noHint"))
                        return
                    } else {
                        hint = hint.replace("_", "\\$&");
                        interaction.channel.send(language.getText(interaction.guild.id, "hintIs")+hint+" "+language.getText(interaction.guild.id, "forChannel")+channel.toString())
                    }

                }

                if(interaction.commandName == "information"){

                    justDiscord.information(interaction)
                }


                if(interaction.commandName == "howido"){

                    //justDiscord.tutorial(interaction)
                    if(pastis){
                    }
                }




                interaction.reply({
                    content: `.`,
                });
                setTimeout(() => {
                    interaction.deleteReply();
                }, 1000)
            } else {
                interaction.reply({
                    content: language.getText(interaction.guild.id, "botNoPermission")
                });
            }

        
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

// supprimer tout les fichiers du dossier lock
fs.readdir("./lock", (err, files) => {
    if (err) throw err;

    for (const file of files) {
        fs.unlink("./lock/"+file, err => {
            if (err) throw err;
        });
    }
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
        Client.application.commands.create(createCommand.hintPokemonCommand)
        Client.application.commands.create(createCommand.informationCommand)
        Client.application.commands.create(createCommand.commentJeFaisCommand)
        
    } catch(e) {

        catchError.saveError(null, null, "index.js", "interactionCreate", e)
        console.error(e)
    }

    
});

process.on('uncaughtException', function (err) {
    
    catchError.saveError(null, null, "GENERAL", "GENERAL", err)
    verifBdd();
    //process.exit(1) // exit application

})

process.on('unhandledRejection', (reason, promise) => {
    verifBdd();
    // Gérer les promesses rejetées ici
    console.error('Promesse rejetée sans gestionnaire :', reason);
  });
    

process.on('exit', (code) => {
    verifBdd();
    console.log(`Le processus se termine avec le code de sortie ${code}`);


});

function verifBdd(){
    
    const folderPath = path.join(__dirname,"..", 'bdd/');

    fs.readdir(folderPath, (err, files) => {
        if (err) {
          console.error(`Erreur lors de la lecture du dossier ${folderPath}: ${err}`);
          return;
        }
      
        files.forEach((file) => {
          const filePath = path.join(folderPath, file);
      
          // Vérifiez si le fichier est un fichier JSON
          if (path.extname(file).toLowerCase() === '.json') {
            repairJSON(filePath);
          }
        });
      });  
}


function repairJSON(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
        console.error(`Erreur lors de la lecture du fichier ${filePath}: ${err}`);
        return;
        }

        if (!isValidJSON(data)) {
        try {
            const parsedData = JSON.parse(data);
            const repairedData = JSON.stringify(parsedData, null, 2); // Indentation de 2 espaces

            fs.writeFile(filePath, repairedData, (err) => {
            if (err) {
                console.error(`Erreur lors de la réparation du fichier JSON ${filePath}: ${err}`);
            } else {
                console.log(`Fichier JSON réparé : ${filePath}`);
            }
            });
        } catch (error) {
            console.error(`Erreur lors de la réparation du fichier JSON ${filePath}: ${error}`);
        }
        }
    });
}



function isValidJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}

