const fonctionJs = require("./fonctionJs");
const eventBdd = require("../bdd/pokemonEvent.json");
const nbEvent = eventBdd.length;
const statEvent = require("./eventStatChange")
const language = require("./language")
const allowChannel = require("./allowSpawnChannel")
const variableGlobal = require("../parameters/variableGlobal")
const Discord = require("discord.js")
const spawnCount = require("./spawnCount")
const pokemonObject = require("../object/PokemonObject")
const pokeData = require("../bdd/pokemon.json");
const catchError = require("./catchError")



/**
  * resort un objet "event" aléatoire
  * 
  */

 function eventSelect(typeEvent, idServer, Client , idChannel){

    try{

        let randomIdEvent
        let bool = true;
        while(bool){
            randomIdEvent = fonctionJs.getRandomInt(nbEvent);
            if(eventBdd[randomIdEvent]["quand"] === typeEvent){
                bool = false;
            }
        }

        if(typeEvent == "avant"){
            activeEventBefore(eventBdd[randomIdEvent], idServer , Client, idChannelRandom)

        } else if(typeEvent == "apres"){

        } else {
            console.log("Erreur c'est avant ou après frere ?")
        }

    } catch(e) {

        catchError.saveError(idServer, null, "eventChoice.js", "eventSelect", e)
        console.error(e)
    }
    
}


function activeEventBefore(event, idServer, Client, idChannel){

    try{


        let numberRandom
        let level

        date = new Date()

        date.setTime(date.getTime() + 30 * 60 * 1000)
        switch(event["id"]){
            case 1:

                numberRandom = fonctionJs.getRandomInt(100)
                level

                if(99 <= numberRandom){
                    level = 3
                    statEvent.changeRarity(idServer, "legendaire", 50, date, event)
                    
                }else if(70 <= numberRandom){
                    level = 2
                    statEvent.changeRarity(idServer, "legendaire", 25, date, event)
                    

                } else {
                    level = 1
                    statEvent.changeRarity(idServer, "legendaire", 10, date, event)
                    

                }
                

                event["textEffect"] = language.getText(idServer, "auraLegendary")+level+". " + language.getText(idServer, "pendantTrenteMinute")

                eventJustEmbed(event, idServer, Client , idChannel);

            break

            case 2:
                event["textEffect"] = language.getText(idServer, "nothing");

                eventJustEmbed(event, idServer, Client , idChannel);

            break
            case 3:


                numberRandom = fonctionJs.getRandomInt(100)
                level

                let theGenChoice = fonctionJs.getRandomInt(variableGlobal.nbGeneration)
                theGenChoice++
                if(99 <= numberRandom){
                    level = 3
                    statEvent.changeGen(idServer, theGenChoice, 20, date, event)
                    
                }else if(70 <= numberRandom){
                    level = 2
                    statEvent.changeGen(idServer, theGenChoice, 10, date, event)
                    

                } else {
                    level = 1
                    statEvent.changeGen(idServer, theGenChoice, 5, date, event)
                    

                }
                


                event["textEffect"] = language.getText(idServer, "auraGeneration")+level+". "+language.getText(idServer, "ofThisGeneration")+theGenChoice+". "  + language.getText(idServer, "pendantTrenteMinute")

                eventJustEmbed(event, idServer, Client , idChannel);

            break
            case 4:
                numberRandom = fonctionJs.getRandomInt(100)
                level

                if(99 <= numberRandom){
                    level = 3
                    statEvent.changeRarity(idServer, "fabuleux", 10, date, event)
                    
                }else if(70 <= numberRandom){
                    level = 2
                    statEvent.changeRarity(idServer, "fabuleux", 5, date, event)
                    

                } else {
                    level = 1
                    statEvent.changeRarity(idServer, "fabuleux", 2, date, event)
                    

                }
                

                event["textEffect"] = language.getText(idServer, "auraFabuleux")+level+". " + language.getText(idServer, "pendantTrenteMinute")


                eventJustEmbed(event, idServer, Client , idChannel);

            break
            case 5:

            arrayOfType = ["acier","dragon","electrik","feu","insecte","plante","psy","sol","tenebres","combat","eau","fee","glace","normal","poison","roche","spectre","vol"]
            
                numberRandom = fonctionJs.getRandomInt(100)
                level
                
                let theTypeChoice = fonctionJs.getRandomInt(arrayOfType.length)

                if(99 <= numberRandom){
                    level = 3
                    statEvent.changeType(idServer, arrayOfType[theTypeChoice], 20, date, event)
                    
                }else if(70 <= numberRandom){
                    level = 2
                    statEvent.changeType(idServer, arrayOfType[theTypeChoice], 10, date, event)
                    

                } else {
                    level = 1
                    statEvent.changeType(idServer, arrayOfType[theTypeChoice], 5, date, event)
                    

                }
                


                event["textEffect"] = language.getText(idServer, "auraType")+level+". "+language.getText(idServer, "ofThisType")+language.getText(idServer, arrayOfType[theTypeChoice])+". "  + language.getText(idServer, "pendantTrenteMinute")

                eventJustEmbed(event,  idServer, Client, idChannel);

            break
            case 6:

                numberRandom = fonctionJs.getRandomInt(100)
                level


                if(99 <= numberRandom){
                    level = 3
                    statEvent.changeShiny(idServer, 2, date, event)
                    
                }else if(70 <= numberRandom){
                    level = 2
                    statEvent.changeShiny(idServer, 1.5, date, event)
                    

                } else {
                    level = 1
                    statEvent.changeShiny(idServer, 1.25, date, event)
                    

                }
                
                
                
                event["textEffect"] = language.getText(idServer, "auraChroma")+level+". "+language.getText(idServer, "pendantTrenteMinute")

            eventJustEmbed(event,idServer, Client, idChannel);


            break

            default:
                console.log("connai pas frere");
                break
        }
    } catch(e) {

        catchError.saveError(idServer, null, "eventChoice.js", "activeEventBefore", e)
        console.error(e)
    }
    

}

function eventJustEmbed(event, idServer, Client, idChannel){

    try{


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

        
        

        Client.channels.cache.get(idChannelRandom).send({ embeds: [eventEmbed], files: [pokeImg]});
        
    } catch(e) {

        catchError.saveError(idServer, null, "eventChoice.js", "eventJustEmbed", e)
        console.error(e)
    }
}


function eventCommandEmbed(interaction, idServer){

    try{


        let event = statEvent.getGeneralStat(idServer, "whatEvent")


        if(event){

            let dateEnd = statEvent.getGeneralStat(idServer, "timer")
            actualDate = new Date();

            dateDiffValue = fonctionJs.dateDiff(actualDate, dateEnd)

            var adressImage = "./src/image/eventImage/"+event["image"]+".png";
            var nameImage = event["image"] + ".png";
            
            let pokeImg = new Discord.AttachmentBuilder(adressImage)


            let eventEmbed = new Discord.EmbedBuilder()
                .setColor(event["color"])
                .setTitle(language.getText(idServer, "actualEvent"))
                .addFields({
                    name: language.getText(idServer, "effect"),
                    value: event["textEffect"],
                    inline: false
                })
                .addFields({
                    name: language.getText(idServer, "timeLeft"),
                    value: dateDiffValue.min+" minutes " +dateDiffValue.sec+" "+language.getText(idServer, "secondes"),
                    inline: false
                })
                .setImage("attachment://"+nameImage)


            interaction.channel.send({embeds: [eventEmbed], files: [pokeImg]})


        } else {
            interaction.channel.send(language.getText(idServer, "noEvent"))
        }
    } catch(e) {

        catchError.saveError(idServer, interaction.channel.id, "eventChoice.js", "eventCommandEmbed", e)
        console.error(e)
    }
    

    
}

function eventAfterShiny(interaction,isShiny){

    try{

        let shinyEvent;
        let randomNumber

        if(isShiny){
            randomNumber = fonctionJs.getRandomInt(10000)

            if(randomNumber == 1){
                shinyEvent = !isShiny
                interaction.channel.send(language.getText(interaction.guild.id, "finallyHesNotShiny"))
            } else{
                shinyEvent = isShiny
            }

        }else {
            randomNumber = fonctionJs.getRandomInt(4096)

            if(randomNumber == 1){
                shinyEvent = !isShiny
                interaction.channel.send(language.getText(interaction.guild.id, "finallyHesShiny"))
            } else{
                shinyEvent = isShiny
            }

        }

        return shinyEvent

    } catch(e) {

        catchError.saveError(interaction.guild.id, interaction.channel.id, "eventChoice.js", "eventAfterShiny", e)
        console.error(e)
    }
    
}

function eventAfterPokemon(idServer, idChannel,isShiny){

    try{


        randomNumber = fonctionJs.getRandomInt(100)


        if(randomNumber == 1){

            arrayPokemonPossible = variableGlobal.pokemonEvent;

            pokemonChoice = fonctionJs.getRandomInt(arrayPokemonPossible.length)

           

            pokemonEvent = pokeData.find(pokemon => arrayPokemonPossible[pokemonChoice] == pokemon.id);
            pokemonEvent["isShiny"] = isShiny
            pokemonEvent["capturable"] = true;

            spawnCount.setPokemonPresent(idServer, pokemon, idChannel)

        }
    } catch(e) {

        catchError.saveError(idServer, idChannel, "eventChoice.js", "eventAfterPokemon", e)
        console.error(e)
    }
}



module.exports = {eventAfterPokemon, eventSelect,eventCommandEmbed,eventAfterShiny}
