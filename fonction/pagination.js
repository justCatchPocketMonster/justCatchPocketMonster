const { ActionRowBuilder, ButtonInteraction, Interaction, Message, ButtonBuilder} = require("discord.js")
const { ButtonStyle } = require('discord.js');
const language = require("../fonction/language")
const fs = require("fs")
const limitPagination = require("../bdd/numberOfPagination.json")
/**
 * @param { Interaction} interactionSlash
 * @param {*} pages 
 * @param {*} time 
 */ 
async function pagination(interactionSlash, interaction, pages, pageParDefaut = 1, time = 60000, arrayImage = []){
    //probleme avec interaction
    var idUser = interactionSlash.member.id

    if(pageParDefaut < 1){
        pageParDefaut = 1;
    }

    if(getNbPagination(idUser) >= 10){
        interactionSlash.channel.send(language.getText(interactionSlash.guild.id, "tooMuchPagination"))
        return
    }

    createNumberFollow(idUser);

    if(!interaction || !pages || !(pages?.length > 0) || !(time > 10000)){ 
        
        if(!interaction){
            throw new Error ("Invalid interaction")
        }
        
        if(!pages){
            throw new Error ("Invalid pages list")
        }
        
        if(!(pages?.length > 0)){
            throw new Error ("Invalid not enought page")
        }
        
        if(!(time > 10000)){
            throw new Error ("Invalid not enought time")
        }
  
        
    };

    var index = pageParDefaut-1
    var row = new ActionRowBuilder()


    row.addComponents([
        new ButtonBuilder()
            .setCustomId("1")
            .setLabel("<")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pages.length<=1)
        ,
        new ButtonBuilder()
            .setCustomId("3")
            .setLabel("X")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false)
        ,
        new ButtonBuilder()
            .setCustomId("2")
            .setLabel(">")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pages.length<=1)

    ]);

    let data

    if(arrayImage[index] !== undefined){
        data = {
            embeds: [pages[index]],
            files: [arrayImage[index]],
            components: [row]
            
        };
    } else {
        data = {
            embeds: [pages[index]],
            components: [row]
        };
    }

    
    
    const filter = (interaction) => {
        return interaction.user.id === interactionSlash.user.id
    }
    await interactionSlash.channel
                    .send(data)
                        .then(messageSendBot => {
                    

        plusOne(idUser)
        const col = messageSendBot.createMessageComponentCollector({
            filter: filter,
            time: time
        });
        col.on('collect', (i) => {

            
            if(i.customId === "1"){
                index--;

                if(index <= -1){
                    index = (pages.length)-1
                }
            } else if (i.customId === "2"){
                index++;

                if(index >= pages.length){
                    index = 0;
                }
            } else{
                return col.stop();
            }
    
            row = new ActionRowBuilder();
            
            row.addComponents([
                new ButtonBuilder()
                    .setCustomId("1")
                    .setLabel("<")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(false)
                ,
                new ButtonBuilder()
                    .setCustomId("3")
                    .setLabel("X")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(false)
                ,
                new ButtonBuilder()
                    .setCustomId("2")
                    .setLabel(">")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(false)
            
                ])
            
            if(arrayImage[index] !== undefined){

                i.update({
                    embeds: [pages[index]],
                    components: [row],
                    files: [arrayImage[index]]
                })
            } else {

                i.update({
                    embeds: [pages[index]],
                    components: [row]
                })
            }

            
            col.resetTimer({time: time})
        })
    
        col.on('end', () => {
            messageSendBot.edit({
                components:[]
            })

            moinsOne(idUser)
        })
    })

}

function createNumberFollow(idUser){
    if(limitPagination[idUser] === undefined){
        limitPagination[idUser] = 0
    }
    SaveBdd()
}

function resetAtZero(){
    for (const [key, value] of Object.entries(limitPagination)){
        limitPagination[key] = 0;
    }
    SaveBdd();
}

function plusOne(idUser){
    limitPagination[idUser]++
    SaveBdd();
}
function moinsOne(idUser){
    limitPagination[idUser]--
    SaveBdd();
}

function getNbPagination(idUser){
    return limitPagination[idUser]
}

function SaveBdd(){
    fs.writeFile("./bdd/numberOfPagination.json", JSON.stringify(limitPagination, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}

module.exports = {resetAtZero, pagination}