
const language = require("./language")
const variableGlobal = require("../parameters/variableGlobal")
const stat = require("./stat");
const { Message } = require("discord.js");
const Discord = require("discord.js");
const prefix = variableGlobal.prefix;
const codeBdd = require("../bdd/code.json")
const fonction = require("../fonction/fonctionJs")


function embedMention(Discord, message){
    let embedDiscord = new Discord.EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Quelque mention et note")
            .addFields([
                { name: language.getText(message.guild.id, "rightTitle") , value:language.getText(message.guild.id, "rightText")  , inline: true},
                { name: language.getText(message.guild.id, "stopTitle") , value: language.getText(message.guild.id, "stopText") , inline: true},

            ]
            )
            message.channel.send({ embeds: [embedDiscord]});
}


function randomStatus(Client){
    let nbStatus = 13;
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
        case 12:
            Client.user.setActivity("!code " + codeBdd["shiny"][fonction.getRandomInt(codeBdd["shiny"].length)], {type: "PLAYING"});
            break
    }

    
}

module.exports= { randomStatus, embedMention}