import {TextChannel, EmbedBuilder} from 'discord.js';
import Planning from "../models/Planning";
import PlanningType from '../types/PlanningType';
import {getSchedule} from "../utils/apiTwitch/apiTwitchClient";
import {convertDate, destroyAllMessage} from "../utils/helperFunction";
import {getImage} from "../utils/imageFunction";

import StreamListByDay from "../types/StreamListByDay";
import planningApi from "../types/PlanningApi";

const weekDay = ["dimanche","lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const arrayEmoteOclock = ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"]
const dateActuel = new Date();
const dateLimite = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate() + 7);

var countVerification = 0;


export default async function updateMessagePlanning(channel: TextChannel){
    try {
        var planning: Array<PlanningType> = await Planning.find({jour: {$in: weekDay}}).exec();
        
        //verification si les jours sont bien enregistré dans la bdd
        for (const key of weekDay) {
            let dayExist = false;
            for (const element of planning) {
                if (element.jour === key) {
                    dayExist = true;
                    break;
                }
            }
            
            if (!dayExist) {
                await planningEmpty(planning);
                planning = await Planning.find({jour: {$in: weekDay}}).exec();
                break; // Sortir de la boucle si le jour n'existe pas car il sera créé
            }
        }
        

        await updatePlanningInBdd(planning);

        await verificationMessagePlanning(channel, planning);

        


        //verification si il y a du changement dans le planning (si oui on update)
        for(const element of planning){
            if(element.changement){
                const message = await channel.messages.fetch(element.idMessage);

                const embed = new EmbedBuilder()

                if(element.planning.length <= 0){

                embed
                    .setTitle(element.jour)
                    .setDescription("Pas de stream prévu ce jour")
                    .setColor(7602354)
                } else {

                    let arrayFields = [];

                    for(const stream of element.planning){

                        const dateStream = convertDate(stream.start_time);
                        const dateEndStream = convertDate(stream.end_time);

                        

                        const randomFirstEmote = Math.floor(Math.random() * arrayEmoteOclock.length);
                        const randomSecondEmote = Math.floor(Math.random() * arrayEmoteOclock.length);

                        
                        arrayFields.push({ name: stream["category"]["name"], value:arrayEmoteOclock[randomFirstEmote]+" "+dateStream.getHours() + ":" + dateStream.getMinutes().toString().padStart(2, '0') + " - "+arrayEmoteOclock[randomSecondEmote]+" " + dateEndStream.getHours() + ":" + dateEndStream.getMinutes().toString().padStart(2, '0'), inline: true})

                    }

                    const image = await getImage(element.planning[0]["category"]["id"]);
                    embed
                            .setTitle(element.jour)
                            .addFields(arrayFields)
                            .setThumbnail(image.replace("{width}", "400").replace("{height}", "500"))
                            .setColor(10879231)

                }

                await message.edit({embeds: [embed]});
                element.changement = false;
                await element.save();
                
            }
        }
    }
    catch (error) {
        console.error(error)
    }
}



async function updatePlanningInBdd(planning : Array<PlanningType>){

    try {
        const scheduleTwitch: planningApi = await getSchedule();
        var startVacances;
        var endVacances;

        if(scheduleTwitch.vacation != null){
            startVacances = convertDate(scheduleTwitch.vacation.start_time);
            endVacances = convertDate(scheduleTwitch.vacation.end_time);
        }

        const arrayStream: StreamListByDay = {
            "lundi": [],
            "mardi": [],
            "mercredi": [],
            "jeudi": [],
            "vendredi": [],
            "samedi": [],
            "dimanche": []
        }
        

        for (const segment of scheduleTwitch.segments) {
            const dateStream = convertDate(segment.start_time);
            const dateEndStream = convertDate(segment.end_time);

            
            if ((scheduleTwitch.vacation == null || (startVacances && endVacances && !(dateStream > startVacances && dateStream < endVacances))) && dateStream < dateLimite) {


                switch (dateStream.getDay()) {
                    case 1:
                        arrayStream["lundi"].push(segment);
                        break;
                    case 2:
                        arrayStream["mardi"].push(segment);
                        break;
                    case 3:
                        arrayStream["mercredi"].push(segment);
                        break;
                    case 4:
                        arrayStream["jeudi"].push(segment);
                        break;
                    case 5:
                        arrayStream["vendredi"].push(segment);
                        break;
                    case 6:
                        arrayStream["samedi"].push(segment);
                        break;
                    case 0:
                        arrayStream["dimanche"].push(segment);
                        break;
                    default:
                        break;
                

                                               
                }
            }
        }

        for(const element of planning){
            element.planning = arrayStream[element.jour];
        }
        
    } catch (error) {
        console.error(error)
    }
    
}

async function planningEmpty(planning : Array<any>){
    await Planning.deleteMany({jour: {$in: weekDay}}).exec();

    for(const element of weekDay){
        const newPlanning = new Planning({
            jour: element,
            planning: [],
            idMessage: "",
            changement: false
        });
        await newPlanning.save();
    }

}

async function messagePlanning(channel: TextChannel, planningOneDay : PlanningType){
    try {

        const message = await channel.send({embeds: [
            new EmbedBuilder()
                .setTitle(planningOneDay.jour)
                .setColor(2662603)]
        });

        planningOneDay.idMessage = message.id;
        planningOneDay.changement = true;

        planningOneDay.save();


    } catch (error) {
        console.error(error)
    }
}

async function verificationMessagePlanning(channel: TextChannel, planning : Array<PlanningType>){
    countVerification++;
    var messageAreValid = true;

    //verification si il y a bien les messages de planning (un message un jour avec son embed)
    for(const [key, value] of Object.entries(planning)){

        //vérification recupêration de chaque message du salon
        const message = await channel.messages.fetch(value["idMessage"]).catch(error => { return({"id" : undefined})} );
        //vérification si le message existe
        if(value["idMessage"] == null || value["idMessage"] == "" || message["id"] == undefined){
            
            messageAreValid = false;
            break;
            
        }
        

    }
    if(!messageAreValid){
        await destroyAllMessage(channel);

        for(const planningOneDay of planning){
            await messagePlanning(channel, planningOneDay);
        }
        await verificationMessagePlanning(channel, planning);

        //évité la recursion infini
        if(countVerification > 10){
            countVerification = 0;
            return;
        }

    }

    
}

