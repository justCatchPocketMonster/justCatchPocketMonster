import {SlashCommandBuilder} from "@discordjs/builders";
import {getMyStream, getSchedule} from "../../utils/apiTwitch/apiTwitchClient"
import {convertDate, dateDiff} from "../../utils/helperFunction"; 
import {getImage} from "../../utils/imageFunction"
import { EmbedBuilder, Interaction } from "discord.js";
import paginationButton from "../../utils/paginationButton";
import PagePagination from "../../types/PagePagination"

import logger from "../../middlewares/error"

export default {
    "name": "planning",
    "command": new SlashCommandBuilder()
    .setName("planning")
    .setDescription("Permet de voir le stream actuel ou quand est le prochain stream"),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            const schedule = await getSchedule();
            const stream = await getMyStream();


            const arrayEmbed: PagePagination[] = [];

            if(stream != undefined){
                arrayEmbed.push({
                    page: new EmbedBuilder()
                    .setTitle(stream.title)
                    .setImage(stream.thumbnail_url.replace("{width}", "400").replace("{height}", "500"))
                    .addFields(
                        { name: "Categorie", value: stream.game_name, inline: false },
                        { name: "Nombre de viewer", value: stream.viewer_count +"", inline: true },
                        { name: "Type de stream", value: stream.type+"", inline: true}
                    )
                    .setColor(10879231)
                .setURL("https://www.twitch.tv/pvcsam")
            })
            }

            let startVacances;
            let endVacances;
            if(schedule.vacation != null){
                startVacances = convertDate(schedule.vacation.start_time);
                endVacances = convertDate(schedule.vacation.end_time);
            } else {
                startVacances = convertDate("2021-01-01T00:00:00Z");
                endVacances = convertDate("2021-01-01T00:00:00Z");
            }
            let count = 0;
            let countTotal = 0;
            let color
    
            const dateActuel = new Date();
            const dateLimite = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate() + 7);
    
            for (const segment of schedule.segments) {
                const dateStream = convertDate(segment.start_time);
                if ((schedule.vacation == null||!(dateStream > startVacances && dateStream < endVacances)) && dateStream < dateLimite&& count < 10) {
                    countTotal++;
                }
            }
    
            for (const segment of schedule.segments) {
                const dateStream = convertDate(segment.start_time);
                const dateEndStream = convertDate(segment.end_time);
    
                
    
                if ((schedule.vacation == null||!(dateStream > startVacances && dateStream < endVacances)) && dateStream < dateLimite && count < 10) {
    
                    
                    count++;
                    
    
                    if(segment.is_recurring){
                        color = 10879231
                    } else {
                        color = 7602354
                    }

                    const imageGame = await getImage(segment.category.id);
    
                    const embed = new EmbedBuilder()
                        .setTitle(segment.title)
                        .addFields(
                            { name: "Categorie", value: segment.category.name, inline: false },
                            { name: "Date", value: dateStream.toLocaleDateString('fr-FR', {weekday: 'long'})+" "+dateStream.toLocaleDateString("fr-FR"), inline: true },
                            { name: "Heure", value: dateStream.toLocaleTimeString("fr-FR"), inline: true },
                            { name: "Durée", value: dateDiff(dateStream, dateEndStream).hour+"h"+dateDiff(dateStream, dateEndStream).min.toString().padStart(2, '0'), inline: true },
                        )
                        .setImage(imageGame.replace("{width}", "400").replace("{height}", "400"))
                        .setColor(color)
                        .setFooter({text: "Pages "+count+"/"+countTotal});
                    
                    arrayEmbed.push({"page" : embed, "imagePage": undefined});
                }
            }
            if(arrayEmbed.length == 0){
                const embed = new EmbedBuilder()
                    .setTitle("Aucun stream")
                    .setDescription("Aucun stream n'est prévu dans les 7 prochains jours :(")
                    .setColor(16711680);
                arrayEmbed.push({"page" : embed, "imagePage": undefined});
            }
            paginationButton(interaction, arrayEmbed);
        } catch (error) {
            logger.error(error);
        }

    }

}