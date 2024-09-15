import { ButtonInteraction, Interaction, APIEmbed, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, MessageCreateOptions } from "discord.js";
const MAX_PAGES_PER_USER = 5;
const userPages = new Map();
import logger from "../middlewares/error"
import PagePagination from "../types/PagePagination";

const plusOne = (idUser: string) => {
    if(userPages.get(idUser) < MAX_PAGES_PER_USER){
        userPages.set(idUser, userPages.get(idUser)+1);
    }
}

const moinsOne = (idUser: string) => {
    if(userPages.get(idUser) > 0){
        userPages.set(idUser, userPages.get(idUser)-1);
    }
}

export default async function paginationButton(interactionSlash: Interaction, pages: PagePagination[], pageParDefaut = 1, time = 60000){
    try {

        if(!(interactionSlash instanceof CommandInteraction) || !interactionSlash.member || !interactionSlash.channel || !interactionSlash.guild || !interactionSlash.user){
            throw new Error("Invalid interaction")
        }


        var idUser = "";

        if ('id' in interactionSlash.member) {
            idUser = interactionSlash.member.id;
        } else {
            idUser = interactionSlash.user.id;
        }
    
        if(pageParDefaut < 1){
            pageParDefaut = 1;
        }
    
        if(!userPages.has(idUser)){
            userPages.set(idUser, 0);
        }

        if(userPages.get(idUser) >= MAX_PAGES_PER_USER){
            return interactionSlash.reply({content: "Tu as dépassé la limite max de page. Ferme les précédentes pages ou patiente que le temps soit écoulé.", ephemeral: true});
        }
    
        if(!ButtonInteraction || !pages || !(pages?.length > 0) || !(time > 10000)){ 
            
            if(!ButtonInteraction){
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
        var row = new ActionRowBuilder<ButtonBuilder>()
    
    
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
    
        let data: MessageCreateOptions
        const pageEmbed = pages[index].page as APIEmbed;
        if(pages[index].imagePage !== undefined){
            const attachment = new AttachmentBuilder(pages[index]?.imagePage ?? "");
            
            data = {
                embeds: [pageEmbed],
                files: [attachment],
                components: [row]
            };
        } else {
            data = {
                embeds: [pageEmbed],
                components: [row]
            };
        }
    
        
        
        const filter = (interaction: Interaction) => {
            if (interaction.isButton()) {
                return interaction.user.id === interactionSlash.user.id;
            }
            return false;
        };

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
                const pageEmbed = pages[index].page as APIEmbed;
                if(pages[index].imagePage !== undefined){
    
                    i.update({
                        embeds: [pageEmbed],
                        components: [row],
                        files: [pages[index]?.imagePage ?? ""]
                    })
                } else {
    
                    i.update({
                        embeds: [pageEmbed],
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

        logger.error(error)
    }
}