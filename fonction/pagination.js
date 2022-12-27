const { ActionRowBuilder, ButtonInteraction, Interaction, Message, ButtonBuilder} = require("discord.js")
const { ButtonStyle } = require('discord.js');
/**
 * @param {Message} message
 * @param {*} pages 
 * @param {*} time 
 */
module.exports = async (message, interaction, pages, pageParDefaut = 0, time = 60000) => {
    //probleme avec interaction

    if(!interaction || !pages || !(pages?.length > 0) || !(time > 10000)){ throw new Error ("Invalid parameters")};

    var index = pageParDefaut-1
    var row = new ActionRowBuilder()
    
    row.addComponents([
    {
        type:"BUTTON",
        customId:"1",
        label: "<",
        style: ButtonStyle.Primary,
        disabled: false
    },
    {
        type:"BUTTON",
        customId:"3",
        label: "X",
        style: ButtonStyle.Danger,
        disabled: false
    },
    {
        type:"BUTTON",
        customId:"2",
        label: ">",
        style: ButtonStyle.Primary,
        disabled: false
    }
    

    ]);
    console.log(row)
    console.log(row.components)

    let data = {
        embeds: [pages[index]],
        components: [row]
        //,fetchReply: true
    };
    
    const filter = (interaction) => {
        return interaction.user.id === message.author.id
    }

    await message.channel.send(data).then(messageSendBot => {
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
                {
                    type:"BUTTON",
                    customId:"1",
                    label: "<",
                    style: ButtonStyle.Primary,
                    disabled: false
                },
                {
                    type:"BUTTON",
                    customId:"3",
                    label: "X",
                    style: ButtonStyle.Danger,
                    disabled: false
                },/*
                {
                    type:"BUTTON",
                    customId:"4",
                    label: "#",
                    style: "SECONDARY",
                    disabled: false
                },*/
                {
                    type:"BUTTON",
                    customId:"2",
                    label: ">",
                    style: ButtonStyle.Primary,
                    disabled: false
                }
            
                ])
            
            i.update({
                components:[row],
                embeds:[pages[index]]
            })
            col.resetTimer({time: time})
        })
    
        col.on('end', () => {
            messageSendBot.edit({
                components:[]
            })
        })
    })

    


   


}