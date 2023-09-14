
const language = require("./language")
const variableGlobal = require("../parameters/variableGlobal")
const stat = require("./stat");
const { Message } = require("discord.js");
const Discord = require("discord.js");
const prefix = variableGlobal.prefix;
const codeBdd = require("../bdd/code.json")
const fonction = require("../fonction/fonctionJs")
const catchError = require("./catchError")
const pagination = require("./pagination")
const code = require("./code")


function randomStatus(Client){
    try{
        let nbStatus = 21;
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
                Client.user.setActivity(stat.getCount(false, true, false)+ " Pokémon sont apparus depuis le début.", {type: "PLAYING"});
                break
            case 4:
                Client.user.setActivity(stat.getCount(false, false, false)+" Pokémon ont été capturés.", {type: "PLAYING"});
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
                Client.user.setActivity(stat.getCount(false, true, false, "version")+ " pokemon have spawned from the start.", {type: "PLAYING"});
                break
            case 9:
                Client.user.setActivity(stat.getCount(false, true, false, "version")+" pokemon have been catched.", {type: "PLAYING"});
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

    } catch(e) {

        catchError.saveError(null, null, "justeDiscord.js", "randomStatus", e)
        console.error(e)
    }
    
}

function embedMentionObligatoire(idServer){
    embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setTitle(language.getText(idServer, "mentionObligatoireTitle"))
        .setDescription(language.getText(idServer, "mentionObligatoireDesc"))
        .setFooter({ text: language.getText(idServer, "mentionObligatoireFooter")})
        .addFields(
            {name: language.getText(idServer, "mentionObligatoireFieldNonAffiliationTitle"), value: language.getText(idServer, "mentionObligatoireFieldNonAffiliationDesc"), inline: false},
            )

            return embed
}

function information(interaction){
    pages = []

    mainPage = new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Information')
        .setDescription(language.getText(interaction.guild.id, "informationDescription"))
    pages.push(
        pagination.createPageForMenu(
            mainPage,
            null,
            language.getText(interaction.guild.id, "principalPage"),
            ""
            )
            )

    pages.push(
        pagination.createPageForMenu(
            embedMentionObligatoire(interaction.guild.id),
            null,
            language.getText(interaction.guild.id, "mentionObligatoireTitle"),
            language.getText(interaction.guild.id, "mentionObligatoireDesc")
            )
        )
    pages.push(
        pagination.createPageForMenu(
                code.codeListEmbed(interaction.user.id, interaction.guild.id),
                null,
                language.getText(interaction.guild.id, "codeListEmbedTitle"),
                language.getText(interaction.guild.id, "codeListEmbedDescription")
            )
        )
    
    pagination.paginationMenu(interaction, language.getText(interaction.guild.id, "selectAPage"), pages)

}


function tutorial(interaction){

    pages = []

    mainPage = 
    pages.push(
        pagination.createPageForMenu(
            new Discord.EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(language.getText(interaction.guild.id, "tutorialTitle"))
                .setDescription(language.getText(interaction.guild.id, "tutorialDescription"))
                .addFields(
                    {name: language.getText(interaction.guild.id, "tutorialField1Title"), value: language.getText(interaction.guild.id, "tutorialField1Desc"), inline: false},
                    {name: language.getText(interaction.guild.id, "tutorialField2Title"), value: language.getText(interaction.guild.id, "tutorialField2Desc"), inline: false},
                    {name: language.getText(interaction.guild.id, "tutorialField3Title"), value: language.getText(interaction.guild.id, "tutorialField3Desc"), inline: false},
                    )
                .setImage("https://cdn.discordapp.com/attachments/1150766647905366086/1150767117206036510/botGifTuto.gif")
            ,
            null,
            language.getText(interaction.guild.id, "baseTutorialTitle"),
            ""
        )
    )

    pages.push(
        pagination.createPageForMenu(
            new Discord.EmbedBuilder()
                .setColor('#7B68EE')
                .setTitle(language.getText(interaction.guild.id, "tutorialAdminTitle"))
                .setDescription(language.getText(interaction.guild.id, "tutorialAdminDescription"))
                .addFields(
                    {name: language.getText(interaction.guild.id, "tutorialAdminField1Title"), value: language.getText(interaction.guild.id, "tutorialAdminField1Desc"), inline: false},
                    {name: language.getText(interaction.guild.id, "tutorialAdminField2Title"), value: language.getText(interaction.guild.id, "tutorialAdminField2Desc"), inline: false},
                    )
            ,
            null,
            language.getText(interaction.guild.id, "tutorialAdminTitle"),
            ""
        )
    )


    pagination.paginationMenu(interaction, language.getText(interaction.guild.id, "selectAPage"), pages)

}

module.exports= {tutorial, randomStatus, information}