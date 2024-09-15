import {SlashCommandBuilder, EmbedBuilder} from"@discordjs/builders";
import { Interaction } from "discord.js";
import {convertDate, dateDiff} from "../../utils/helperFunction"; 
import {getMyStream, getSchedule} from "../../utils/apiTwitch/apiTwitchClient"
import {getImage} from "../../utils/imageFunction"

import logger from "../../middlewares/error"

export default {
    "name": "stream-actuel",
    "command": new SlashCommandBuilder()
    .setName("stream-actuel")
    .setDescription("Permet de voir le planning."),
    "actif": false,
    async execute(interaction: Interaction){
        try {
            if (!interaction.channel) {
                throw new Error("L'interaction n'est pas dans un channel");
            }

            const stream = await getMyStream();
            const embed = new EmbedBuilder()
    
            if(stream == undefined){
    
                const schedule = await getSchedule();
                var startVacances: Date | undefined = undefined;
                var endVacances: Date | undefined = undefined;
    
                if(schedule.vacation != null){
                    startVacances = convertDate(schedule.vacation.start_time);
                    endVacances = convertDate(schedule.vacation.end_time);
                }
                
                const dateActuel = new Date();
                
                var firstSchedulePossible;
    
                for (const segment of schedule.segments) {
                    const dateStreamBoucle = convertDate(segment.start_time);
                    if(startVacances !== undefined && endVacances !== undefined)
                    if (schedule.vacation == null||!(dateStreamBoucle > startVacances && dateStreamBoucle < endVacances)) {
                        firstSchedulePossible = segment;
                        break;
                    }
                }
                const dateStream = convertDate(firstSchedulePossible.start_time);
                const dateEndStream = convertDate(firstSchedulePossible.end_time);

                const imageGame = await getImage(firstSchedulePossible.category.id);

                embed
                    .setTitle("Prochain stream")
                    .setDescription("Aucun stream n'est actuellement en cours, voici le prochain stream")
                    .setColor(13529599)
                    .addFields(
                        { name: "Titre", value: firstSchedulePossible.title, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true},
                        { name: "Categorie", value: firstSchedulePossible.category.name, inline: true },
                        { name: "Date", value: dateStream.toLocaleDateString('fr-FR', {weekday: 'long'})+" "+dateStream.toLocaleDateString("fr-FR"), inline: true },
                        { name: "Heure", value: dateStream.toLocaleTimeString("fr-FR"), inline: true },
                        { name: "Durée", value: dateDiff(dateStream, dateEndStream).hour+"h"+dateDiff(dateStream, dateEndStream).min.toString().padStart(2, '0'), inline: true },
                        { name: "Compte à rebours", value: dateDiff(dateActuel, dateStream).day+"j "+dateDiff(dateActuel, dateStream).hour+"h"+dateDiff(dateActuel, dateStream).min.toString().padStart(2, '0'), inline: false },
                    )
                    .setImage(imageGame.replace("{width}", "400").replace("{height}", "400"))
    
            
            } else {
    
                embed
                    .setTitle(stream.title)
                    .setImage(stream.thumbnail_url.replace("{width}", "711").replace("{height}", "400"))
                    .addFields(
                        { name: "Categorie", value: stream.game_name, inline: false },
                        { name: "Nombre de viewer", value: stream.viewer_count +"", inline: true },
                        { name: "Type de stream", value: stream.type+"", inline: true}
                    )
                    .setColor(10879231)
                    .setURL("https://www.twitch.tv/pvcsam")
            
            }
    
            interaction.channel.send({embeds: [embed]})
        } catch (error) {
            logger.error(error)
        }
    }

}