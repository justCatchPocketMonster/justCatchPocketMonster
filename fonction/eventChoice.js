const fonctionJs = require("./fonctionJs");
const eventBdd = require("../bdd/pokemonEvent.json");
const nbEvent = eventBdd.length;
const statEvent = require("./eventStatChange")
const language = require("./language")
const allowChannel = require("./allowSpawnChannel")
const variableGlobal = require("../parameters/variableGlobal")



/**
  * resort un objet "event" aléatoire
  * 
  */

 function eventSelect(typeEvent, Discord, idServer, Client){
    let randomIdEvent
    let bool = true;
    while(bool){
        randomIdEvent = fonctionJs.getRandomInt(nbEvent);
        if(eventBdd[randomIdEvent]["quand"] === typeEvent){
            bool = false;
        }
    }

    if(typeEvent == "avant"){
        activeEventBefore(eventBdd[randomIdEvent], Discord, idServer , Client)

    } else if(typeEvent == "apres"){

    } else {
        console.log("Erreur c'est avant ou après frere ?")
    }

    
}


function activeEventBefore(event, Discord, idServer, Client){

    let numberRandom
    let level
    console.log(event["id"])
    switch(event["id"]){
        case 1:

            numberRandom = fonctionJs.getRandomInt(100)
            level

            if(100 <= numberRandom){
                level = 3
                statEvent.changeRarity(idServer, "legendaire", 50, 1800, event)
                
            }else if(70 <= numberRandom){
                level = 2
                statEvent.changeRarity(idServer, "legendaire", 25, 1800, event)
                

            } else {
                level = 1
                statEvent.changeRarity(idServer, "legendaire", 10, 1800, event)
                

            }
            

            event["textEffect"] = language.getText(idServer, "auraLegendary")+level+". " + language.getText(idServer, "pendantTrenteMinute")

            eventJustEmbed(event, Discord , idServer, Client);

        break

        case 2:
            event["textEffect"] = language.getText(idServer, "nothing");

            eventJustEmbed(event, Discord , idServer, Client);

        break
        case 3:


            numberRandom = fonctionJs.getRandomInt(100)
            level

            let theGenChoice = fonctionJs.getRandomInt(variableGlobal.nbGeneration)
            theGenChoice++
            if(100 <= numberRandom){
                level = 3
                statEvent.changeGen(idServer, theGenChoice, 20, 1800, event)
                
            }else if(70 <= numberRandom){
                level = 2
                statEvent.changeGen(idServer, theGenChoice, 10, 1800, event)
                

            } else {
                level = 1
                statEvent.changeGen(idServer, theGenChoice, 5, 1800, event)
                

            }
            


            event["textEffect"] = language.getText(idServer, "auraGeneration")+level+". "+language.getText(idServer, "ofThisGeneration")+theGenChoice+". "  + language.getText(idServer, "pendantTrenteMinute")

            eventJustEmbed(event, Discord , idServer, Client);

        break
        case 4:
            numberRandom = fonctionJs.getRandomInt(100)
            level

            if(100 <= numberRandom){
                level = 3
                statEvent.changeRarity(idServer, "fabuleux", 10, 1800, event)
                
            }else if(70 <= numberRandom){
                level = 2
                statEvent.changeRarity(idServer, "fabuleux", 5, 1800, event)
                

            } else {
                level = 1
                statEvent.changeRarity(idServer, "fabuleux", 2, 1800, event)
                

            }
            

            event["textEffect"] = language.getText(idServer, "auraFabuleux")+level+". " + language.getText(idServer, "pendantTrenteMinute")


            eventJustEmbed(event, Discord , idServer, Client);

        break
        case 5:

        arrayOfType = ["acier","dragon","electrik","feu","insecte","plante","psy","sol","tenebres","combat","eau","fee","glace","normal","poison","roche","spectre","vol"]
        
            numberRandom = fonctionJs.getRandomInt(100)
            level

            let theTypeChoice = fonctionJs.getRandomInt(arrayOfType.length)
            theTypeChoice++
            if(100 <= numberRandom){
                level = 3
                statEvent.changeType(idServer, arrayOfType[theTypeChoice], 20, 1800, event)
                
            }else if(70 <= numberRandom){
                level = 2
                statEvent.changeType(idServer, arrayOfType[theTypeChoice], 10, 1800, event)
                

            } else {
                level = 1
                statEvent.changeType(idServer, arrayOfType[theTypeChoice], 5, 1800, event)
                

            }
            


            event["textEffect"] = language.getText(idServer, "auraGeneration")+level+". "+language.getText(idServer, "ofThisType")+language.getText(idServer, arrayOfType[theTypeChoice])+". "  + language.getText(idServer, "pendantTrenteMinute")

            eventJustEmbed(event, Discord , idServer, Client);

        break
        case 6:

            numberRandom = fonctionJs.getRandomInt(100)
            level


            if(100 <= numberRandom){
                level = 3
                statEvent.changeShiny(idServer, 2, 1800, event)
                
            }else if(70 <= numberRandom){
                level = 2
                statEvent.changeShiny(idServer, 1.5, 1800, event)
                

            } else {
                level = 1
                statEvent.changeShiny(idServer, 1.25, 1800, event)
                

            }
            
            
            
            event["textEffect"] = language.getText(idServer, "auraChroma")+level+". "+language.getText(idServer, "pendantTrenteMinute")

        eventJustEmbed(event, Discord , idServer, Client);


        break

        default:
            console.log("connai pas frere");
            break
    }

}

function eventJustEmbed(event, Discord , idServer, Client){

    var adressImage = "./src/image/eventImage/"+event["image"]+".png";
    var nameImage = event["image"] + ".png";
    
    let pokeImg = new Discord.AttachmentBuilder(adressImage)

    let eventEmbed = new Discord.EmbedBuilder()
        .setColor(event["color"])
        .setTitle(language.getText(idServer, event["nom"]))
        .setDescription(language.getText(idServer, event["description"]))
        .addFields({
            name: language.getText(idServer, "effect"),
            value: event["textEffect"],
            inline: false
        })
        .setImage("attachment://"+nameImage)
    
    
    idChannelRandom = allowChannel.randomIdServer(idServer)

    Client.channels.cache.get(idChannelRandom).send({ embeds: [eventEmbed], files: [pokeImg]});
}


//TODO:
function eventCommandEmbed(interaction, Discord , idServer){

    let event = statEvent.getGeneralStat(idServer, "whatEvent")

    let tempsRestantSeconde = statEvent.getGeneralStat(idServer, "timer")

    let tempsConvertie = ""

    var adressImage = "./src/image/eventImage/"+event["image"]+".png";
    var nameImage = event["image"] + ".png";
    
    let pokeImg = new Discord.AttachmentBuilder(adressImage)


    let eventEmbed = new Discord.EmbedBuilder()
        .setColor(event["color"])
        .setTitle(language.getText(idServer, event["nom"]))
        .setDescription(language.getText(idServer, event["description"]))
        .addFields({
            name: language.getText(idServer, "effect"),
            value: event["textEffect"],
            inline: false
        })
        .addFields({
            name: language.getText(idServer, "timeLeft"),
            value: tempsConvertie,
            inline: false
        })
        .setImage("attachment://"+nameImage)


    interaction.channel.send({embeds: [eventEmbed], files: [pokeImg]})
}



module.exports = {eventSelect}
