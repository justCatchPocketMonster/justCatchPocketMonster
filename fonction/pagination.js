const {StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonInteraction, Interaction, Message, ButtonBuilder} = require("discord.js")
const { ButtonStyle } = require('discord.js');
const fs = require("fs")
const limitPagination = require("../bdd/numberOfPagination.json")
const path = require('path');
const catchError = require("./catchError")
const lockfile = require('lockfile');

class pagination{
        
    /**
     * @param { Interaction} 
     * @param {[{page, imagePage}]} pages 
     * @param {*} time 
     */ 
    static async paginationButton(interactionSlash, pages, pageParDefaut = 1, time = 60000){
        try {

            interaction = ButtonInteraction
            //probleme avec interaction
            var idUser = interactionSlash.member.id
        
            if(pageParDefaut < 1){
                pageParDefaut = 1;
            }
        
            if(getNbPagination(idUser) >= 10){
                interactionSlash.channel.send("Trop de page")
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
        
            if(pages[index].imagePage !== undefined){
                data = {
                    embeds: [pages[index].page],
                    files: [pages[index].imagePage],
                    components: [row]
                    
                };
            } else {
                data = {
                    embeds: [pages[index].page],
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
                    
                    if(pages[index].imagePage !== undefined){
        
                        i.update({
                            embeds: [pages[index].page],
                            components: [row],
                            files: [pages[index].imagePage]
                        })
                    } else {
        
                        i.update({
                            embeds: [pages[index].page],
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
        
        } catch(error) {

            console.error(error)
        }
    }

    static createPageForMenu(page, image = null, nameSelection, descriptionSelection){
        if(image !== null){
            return {page: page, imagePage: image, information: {nameSelection: nameSelection, descriptionSelection: descriptionSelection}}
        } else {
            return {page: page, information: {nameSelection: nameSelection, descriptionSelection: descriptionSelection}}
        }
    }

    /**
     * 
     * @param {Interaction} interaction 
     * @param {[{page, image , information : {nameSelection, descriptionSelection}}]} menuInformation 
     * @param {int} pageParDefaut 
     * @param {*} time 
     * @param {*} arrayImage 
     */
    static async paginationMenu(interaction, defaultText, pages, pageParDefaut = 1, time = 60000){
        try {
            let components = []
            let count = 0

            pages.forEach(element => {
                selectMenuCreation = new StringSelectMenuOptionBuilder()
                    .setLabel(element.information.nameSelection)
                    .setValue(count+"")

                if(element.information.descriptionSelection !== undefined && element.information.descriptionSelection !== null && element.information.descriptionSelection !== ""){
                    selectMenuCreation.setDescription(element.information.descriptionSelection)
                }

                components.push(selectMenuCreation)
                count++
            });

            const menuSelect = new StringSelectMenuBuilder()
            .setCustomId('menu')
            .setPlaceholder(defaultText)
            .addOptions(
                components.map((e) => e.toJSON())
            )

            const menu = new ActionRowBuilder()
                .addComponents(
                    menuSelect
                )

            const data = {
                fetchReply: true,
                components: [menu],
                embeds: [pages[pageParDefaut-1].page]
            }

            if(pages[pageParDefaut-1].imagePage !== undefined){
                data.files = [pages[pageParDefaut-1].imagePage]
            }

            msg = await interaction.channel.send(data)

            const col = msg.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: time
            })

            col.on('collect', async (i) => {
                let selectedOption = i.values[0];

                while(pages[selectedOption].page === undefined || pages[selectedOption].page === null){
                    selectedOption++
                }
                menu.components[0].data.placeholder = pages[selectedOption].information.nameSelection

                if(pages[i.values[0]].imagePage !== undefined){
        
                    await i.update({
                        embeds: [pages[selectedOption].page],
                        components: [menu],
                        files: [pages[selectedOption].imagePage]
                    })
                } else {

                    await i.update({
                        embeds: [pages[selectedOption].page],
                        components: [menu]
                    })
                }
                col.resetTimer({time: time})

            })

            col.on('end', async () => {
                await msg.edit({
                    components: []
                })
            })

        } catch(error) {

            console.error(error)
        }
    }

    static createNumberFollow(idUser){
        try {
            if(limitPagination[idUser] === undefined){
                limitPagination[idUser] = 0
            }
            SaveBdd()
        } catch(error) {

            console.error(error)
        }
    }

    static resetAtZero(){
        try {
            for (const [key, value] of Object.entries(limitPagination)){
                limitPagination[key] = 0;
            }
            SaveBdd();
        } catch(error) {

            console.error(error)
        }
    }

    static plusOne(idUser){
        try {
            limitPagination[idUser]++
            SaveBdd();
        } catch(error) {

        }
    }
    static moinsOne(idUser){
        try {
            limitPagination[idUser]--
            SaveBdd();
        } catch(error) {

            console.error(error)
        }
    }

    static getNbPagination(idUser){
        try {
            return limitPagination[idUser]
        } catch(error) {

            console.error(error)
        }
    }

    static SaveBdd(){

        const lockfilePath = path.join(__dirname,"..", 'lock', 'numberOfPagination.lock');

        try{
            lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
                if (err) {
                    console.error('Erreur lors du verrouillage du fichier :', err);
                    return;
                }
                
            fs.writeFile(path.join(__dirname,"..", 'bdd', 'numberOfPagination.json'), JSON.stringify(limitPagination, null, 4), (err)=> {
                if (err)console.log("erreur")

                lockfile.unlock(lockfilePath, (err) => {
                    if (err) {
                        console.error('Erreur lors du déverrouillage du fichier :', err);
                    }
                });
            });
        });
        } catch(e) {

            catchError.saveError(null, null, "pagination.js", "SaveBdd", e)
            console.error(e)
        }

    }
}
module.exports = pagination