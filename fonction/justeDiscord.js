
const language = require("./language")
const variableGlobal = require("../parameters/variableGlobal")
const stat = require("./stat");
const { Message } = require("discord.js");
const Discord = require("discord.js");
const prefix = variableGlobal.prefix;

/**
 * 
 * @param {Discord} Discord 
 * @param {Message} message 
 */
function embedHelp(Discord, message){
    let embedDiscord = new Discord.MessageEmbed()
            .setColor("#0099FF")
            .setTitle(language.getText(message.guild.id, "helpTitle"))
            .addFields([
                { name:prefix+"spawn" , value:language.getText(message.guild.id, "commandSpawnExplication")  , inline: true},
                { name: prefix+"unspawn" , value: language.getText(message.guild.id, "commandUnspawnExplication") , inline: true},
                { name: prefix+"catch [", value:+language.getText(message.guild.id, "commandCatchExtension")+"]" , value: language.getText(message.guild.id, "commandCatchExplication") , inline: true},
                { name: prefix+"pokedex ["+language.getText(message.guild.id, "commandPokedexExtension")+"]" , value: language.getText(message.guild.id, "commandPokedexExplication") , inline: true},
            ]
            )
    message.channel.send({ embeds: [embedDiscord]})
    .then(console.log("tamere"))
    .catch(console.log("nul nul nul"))
}

function embedMention(Discord, message){
    let embedDiscord = new Discord.MessageEmbed()
            .setColor("#FF0000")
            .setTitle("Quelque mention et note")
            .addFields([
                { name: language.getText(message.guild.id, "rightTitle") , value:language.getText(message.guild.id, "rightText")  , inline: true},
                { name: language.getText(message.guild.id, "stopTitle") , value: language.getText(message.guild.id, "stopText") , inline: true},

            ]
            )
            message.channel.send({ embeds: [embedDiscord]});
}


//a faire plus tard
function embedCreateur(Discord, message){
    let embedDiscord = new Discord.MessageEmbed()
            .setColor("#0099FF")
            .setTitle("This is PVCSAM")
            .addField("wesh", "[salut](https://www.youtube.com/)")
            .addFields([
                { name: "Droit" , value:"[salut](https://www.youtube.com/)"  , inline: true},
                { name: "Stop" , value: "oui" , inline: true}
            ]
            )
            message.channel.send({ embeds: [embedDiscord]});
}


function randomStatus(Client){
    let nbStatus = 12;
    let randomStatus = Math.floor(Math.random()* nbStatus);
    /*
    les types
    COMPETING - participe a une compétition
    LISTENING - écoute musique
    PLAYING - joue a un jeu
    STREAMING - bas c'est marqué
    WATCHING - regarde
    */
    switch(randomStatus){
        case 0:
            Client.user.setActivity("Je suis en "+ variableGlobal.version +" :D");
            break
        case 1:
            Client.user.setActivity("Je suis désolé les anglophones, je suis français.", {type: "PLAYING"});
            break
        case 2:
            Client.user.setActivity("Un oublie de commande ? "+ prefix+"help", {type: "PLAYING"});
            break
        case 3:
            Client.user.setActivity(stat.getCountAllSpawn()+ " Pokémon sont apparus depuis le début.", {type: "PLAYING"});
            break
        case 4:
            Client.user.setActivity(stat.getCountAllCatch()+" Pokémon ont été capturés.", {type: "PLAYING"});
            break
        case 5:
            Client.user.setActivity("I'm on "+ variableGlobal.version +" :D", {type: "PLAYING"});
            break
        case 6:
            Client.user.setActivity("I'm sorry English speakers I'm French.", {type: "PLAYING"});
            break
        case 7:
            Client.user.setActivity("Forgot a command ? "+ prefix+"help", {type: "PLAYING"});
            break
        case 8:
            Client.user.setActivity(stat.getCountAllSpawn()+ " pokemon have spawned from the start.", {type: "PLAYING"});
            break
        case 9:
            Client.user.setActivity(stat.getCountAllCatch()+" pokemon have been catched.", {type: "PLAYING"});
            break
        case 10:
            Client.user.setActivity("Je coûte 1,5 euro d'hébergement chaque mois.", {type: "PLAYING"});
            break
        case 11:
            Client.user.setActivity("I cost 1.5 euro hosting each month.", {type: "PLAYING"});
            break
    }

    
}

module.exports= {embedHelp, randomStatus, embedMention, embedCreateur}