import {SlashCommandBuilder} from "@discordjs/builders";
import {AttachmentBuilder, ChatInputCommandInteraction, ColorResolvable, Interaction} from "discord.js";
import logger from "../../middlewares/error"
import language from "../../lang/language";
import {getServerById} from "../../cache/ServerCache";
import {EmbedBuilder} from "discord.js";

export default {
    "name": "currentminievent",
    "command": new SlashCommandBuilder()
    .setName("currentminievent")
        .setNameLocalizations({
                'fr': "actuelminievent"
        })
        .setDescription(language("commandEffectEvent","eng"))
        .setDescriptionLocalizations({
                'fr': language("commandEffectEvent","fr")
        })
    ,
    "actif": true,
    async execute(interaction: ChatInputCommandInteraction){
        try{
            if(interaction.guildId === null) return;
            let server = await getServerById(interaction.guildId);
            let event = server.eventSpawn


            if(event.whatEvent){

                let dateEnd = new Date(event.whatEvent.endTime);
                const actualDate = new Date();
                const dateDiffValue = dateEnd.getTime() - actualDate.getTime();
                const totalSeconds = Math.floor(dateDiffValue / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;

                var adressImage = "./src/image/eventImage/"+event.whatEvent.image+".png";
                var nameImage = event.whatEvent.image + ".png";

                let pokeImg = new AttachmentBuilder(adressImage)


                let eventEmbed = new EmbedBuilder()
                    .setColor(event.whatEvent.color as ColorResolvable)
                    .setTitle(language("actualEvent",server.language))
                    .addFields({
                        name: language("effect",server.language),
                        value: event.whatEvent.effectDescription,
                        inline: false
                    })
                    .addFields({
                        name: language("timeLeft",server.language),
                        value: minutes+" minutes " +seconds+" "+language("secondes",server.language),
                        inline: false
                    })
                    .setImage("attachment://"+nameImage)

                return interaction.reply({embeds: [eventEmbed], files: [pokeImg], ephemeral: false});

            } else {
                return interaction.reply({content: language("noEvent",server.language), ephemeral: true});
            }
        } catch (e) {
            logger.error(e)
        }
        
    }

}