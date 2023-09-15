const { AttachmentBuilder, Client, ButtonInteraction, TextInputStyle } = require("discord.js")
const Discord = require("discord.js")
const variableGlobal = require("../parameters/variableGlobal")
const stat = require("../fonction/stat")
const pokeDataAll = require("../bdd/pokemon.json");
const index = require("../index")
const pokemonObject = require("../object/PokemonObject")
const savePokemonUser = require("./pokedexSaveUser")
const saveShinyUser = require("./shinydexSaveUser")
const savePokemonServer = require("./pokedexSaveServer")
const fonction = require("../fonction/fonctionJs")
const allowChannel = require("./allowSpawnChannel")
const spawnCount = require("./spawnCount")
const language = require("./language")
const pokemonSpawnFollow = require("./pokemonSpawnFollow")
const eventChoice = require("./eventChoice")
const eventStatChange = require("./eventStatChange")
const catchError = require("./catchError")
const pokemonForm = require("./pokemonform");



const pagination = require("./pagination")

const prefix = variableGlobal.prefix;
var pokemon = undefined;



/**
 * 
 * creer un embed avec les informations d'un pokemon
 */
function embedPokemon(Discord, message, pokemon, Client, idChannel, isShiny){

    try {
        let imageRandom = fonction.getRandomInt(pokemon["imgName"].length);

        if(eventStatChange.getGeneralStat(message.guild.id, "nightMode")){
            adressImage = "./src/image/pokeHomeShadow/"+pokemon["imgName"][imageRandom]+".png";
            var nameImage = pokemon["imgName"][imageRandom] + ".png";
        } else {
            if(pokemon["isShiny"]){
            
                var adressImage = "./src/image/pokeHome/"+pokemon["imgName"][imageRandom]+"-shiny.png";
                var nameImage = pokemon["imgName"][imageRandom] + "-shiny.png";
            } else {
                var adressImage = "./src/image/pokeHome/"+pokemon["imgName"][imageRandom]+".png";
                var nameImage = pokemon["imgName"][imageRandom] + ".png";
            }
        }
        
        
        
        let pokeImg = new AttachmentBuilder(adressImage)
    
    
        let pokeEmbed = new Discord.EmbedBuilder()
            .setColor(fonction.colorByType(pokemon["typeListEng"][fonction.getRandomInt(pokemon["typeListEng"].length)]))
            .setTitle(language.getText(message.guild.id, "embedPokemonTitle"))
            .setDescription(language.getText(message.guild.id, "embedPokemonDescription"))
            //.attachFiles(pokeImg);
            .setImage("attachment://"+ nameImage)
    
        Client.channels.cache.get(idChannel).send({ embeds: [pokeEmbed], files: [pokeImg]});
        return(pokemon["id"])
    } catch(error) {

        catchError.saveError(message.guild.id, message.channel.id, "pokemonController.js", "embedPokemon", error)
        console.error(error)
    }
}

/**
 * 
 * @param {*} Discord 
 * @param {*} message 
 * @param {*} Client 
 */
function spawnPokemon(Discord, message, Client){
    try {
        let idServer = message.guild.id;
        let idChannel = message.channel.id;
        
        if(spawnCount.getCount(idServer, idChannel) === 0){
            spawnCount.setMaxRandom(idServer, idChannel)
        }
        if (spawnCount.getCount(idServer, idChannel) != null){
            spawnCount.setCount(idServer, spawnCount.getCount(idServer, idChannel)+1, idChannel)
        }
        
        if(spawnCount.getCount(idServer, idChannel) >= spawnCount.getMaxRandom(idServer, idChannel)){

            if(allowChannel.idChannelExist(message.channel.id, idServer)){
                idChannelRandom = message.channel.id
            } else {
    
                idChannelRandom = allowChannel.randomIdServer(idServer, Client)
            }
            
            let typeSpawn = choiceTypeOfSpawn(Discord, message, spawnCount.getPokemonPresent(idServer, idChannelRandom), idChannelRandom, Client, idServer);
            
            if(typeSpawn == "pokemon"){
                stat.statAddSpawn(spawnCount.getPokemonPresent(idServer, idChannelRandom)["id"], spawnCount.getPokemonPresent(idServer, idChannelRandom)["isShiny"], spawnCount.getPokemonPresent(idServer, idChannelRandom)["form"]);  
            }
    
            spawnCount.setCount(idServer, 0, idChannel)
        }
    } catch(error) {

        catchError.saveError(message.guild.id, message.channel.id, "pokemonController.js", "spawnPokemon", error)
        console.error(error)
    }

}


/**
 * 
 * @param {Discord} Discord 
 * @param {Discord.ChatInputCommandInteraction} interaction 
 * @param {Client} Client 
 * @returns 
 */
function catchPokemon(Discord, interaction, Client, optionString){

    try {
        messageEnvoyer = optionString;
        let idServer = interaction.guild.id;
        let idChannel = interaction.channel.id;
        var name 

        if(interaction.member.nickname != null){
            name = interaction.member.nickname
        } else {
            name = interaction.member.displayName;
        }

    
        if(spawnCount.getPokemonPresent(idServer,idChannel) != null && spawnCount.getPokemonPresent(idServer,idChannel)["capturable"] === true){
            if((messageEnvoyer.toLowerCase() === spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameFr"].toLowerCase()) || 
                messageEnvoyer.toLowerCase() === spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameEng"].toLowerCase()){
    
                    savePokemonUser.pokedex(spawnCount.getPokemonPresent(idServer, idChannel)["id"], interaction.member.id)
                    savePokemonServer.pokedex(spawnCount.getPokemonPresent(idServer, idChannel)["id"], interaction.guild.id)
                    shinyAfterEvent = eventChoice.eventAfterShiny(interaction,spawnCount.getPokemonPresent(idServer, idChannel)["isShiny"]);
    
    
                    if(shinyAfterEvent){
                        saveShinyUser.pokedex(spawnCount.getPokemonPresent(idServer, idChannel)["id"], interaction.member.id)
                    }
                    if(shinyAfterEvent == true && spawnCount.getPokemonPresent(idServer, idChannel)["isShiny"] == false){
                        stat.statAddSpawn(spawnCount.getPokemonPresent(idServer, idChannel)["id"], shinyAfterEvent, spawnCount.getPokemonPresent(idServer, idChannelRandom)["form"])
                    }
                    stat.statAddCatch(spawnCount.getPokemonPresent(idServer, idChannel)["id"], shinyAfterEvent, spawnCount.getPokemonPresent(idServer, idChannelRandom)["form"])
                    realPokemon = pokeDataAll.find(pokemon => pokemon.id == spawnCount.getPokemonPresent(idServer, idChannel)["id"])
                    


                    if(realPokemon["name"]["nameFr"] != realPokemon["name"]["nameEng"]){


                        let messageCongratSend = language.getText(interaction.guild.id, "congratYouCatchPart1")+name+language.getText(interaction.guild.id, "congratYouCatchPart2")+ realPokemon["name"]["nameFr"] +"/"+ realPokemon["name"]["nameEng"];
                        if(spawnCount.getPokemonPresent(idServer, idChannel)["form"] != null){
                            messageCongratSend += " <:MEGA:1139228792989155359>"
                            pokemonForm.addPokemon(interaction.member.id, realPokemon["id"], spawnCount.getPokemonPresent(idServer, idChannel)["form"], shinyAfterEvent)
                        } 
                        if(shinyAfterEvent){
                            messageCongratSend += ":star:. "
                        } else {
                            messageCongratSend += ". "
                        }
                        if(savePokemonUser.getNumberCapturePokemon(interaction.member.id, realPokemon["id"]) == 1){
                            messageCongratSend += language.getText(interaction.guild.id, "newAtPokedex")
    
                        }
    
                        interaction.channel.send(messageCongratSend)
                        
                    }else{
                        let messageCongratSend = language.getText(interaction.guild.id, "congratYouCatchPart1")+name+language.getText(interaction.guild.id, "congratYouCatchPart2")+ realPokemon["name"]["nameFr"];
                        
                        if(spawnCount.getPokemonPresent(idServer, idChannel)["form"] != null){
                            messageCongratSend += " <:MEGA:1139228792989155359>"
                            pokemonForm.addPokemon(interaction.member.id, realPokemon["id"], spawnCount.getPokemonPresent(idServer, idChannel)["form"], shinyAfterEvent)
                        } 
                        if(shinyAfterEvent){
                            messageCongratSend += ":star:. "
                        } else {
                            messageCongratSend += ". "
                        }
                        
                        if(savePokemonUser.getNumberCapturePokemon(interaction.member.id, realPokemon["id"]) == 1){
                            messageCongratSend += language.getText(interaction.guild.id, "newAtPokedex")
    
                        }
    
                        interaction.channel.send(messageCongratSend)
                    }
    
                    spawnCount.setPokemonPresent(idServer,null, idChannel);
                    return
                }else{
    
                    interaction.channel.send(language.getText(interaction.guild.id, "failCatchGoodPokemonPart1")+" "+ name +""+ language.getText(interaction.guild.id, "failCatchGoodPokemonPart2")+" "+ optionString+".")
                    return
                    
                }
            }else {
    
                    
                interaction.channel.send(language.getText(interaction.guild.id, "noPokemonDisponible"))
                return
            }
    
    } catch(error) {

        catchError.saveError(interaction.guild.id, interaction.channel.id, "pokemonController.js", "catchPokemon", error)
        console.error(error)
    }

        
}


function choiceTypeOfSpawn(Discord, message, pokemon, idChannel, Client, idServer){
    
    try {
        nbRand = fonction.getRandomInt(variableGlobal.valeurMaxChoiceEvent)

        if(variableGlobal.valeurMaxEvent>= nbRand && eventStatChange.getGeneralStat(idServer,"whatEvent") === false){
            eventChoice.eventSelect("avant", message.guild.id, Client, idChannel)
    
            return("event")
    
        } else {

            nbRand = fonction.getRandomInt(eventStatChange.getGeneralStat(message.guild.id, "valeurMaxChoiceEgg"))
            if(variableGlobal.valeurMaxEgg >= nbRand){
                pokemonEgg = Object.assign({},pokeDataAll[fonction.getRandomInt(pokeDataAll.length)]);
                pokemonEgg["imgName"] = pokeDataAll[0]["imgName"]
                pokemonEgg["name"] = pokeDataAll[0]["name"]

                pokemonEgg = pokemonObject.shinySelect(pokemonEgg, idServer, true);
                pokemonEgg["capturable"] = true;
                spawnCount.setPokemonPresent(idServer, pokemonEgg, idChannel);
                embedPokemon(Discord, message, pokemonEgg, Client, idChannel)
                pokemonSpawnFollow.addPokemon(pokemonEgg);

            } else {

            
                pokemon = pokemonObject.pokemonSelect(idServer);
        
                pokemon = pokemonObject.shinySelect(pokemon, idServer, false);
                pokemon["capturable"] = true;
                spawnCount.setPokemonPresent(idServer, pokemon, idChannel);
                embedPokemon(Discord, message, pokemon, Client, idChannel)
                pokemonSpawnFollow.addPokemon(pokemon);
        
                return("pokemon")
            }
        }
    
        
    
    } catch(error) {

        catchError.saveError(message.guild.id, message.channel.id, "pokemonController.js", "choiceTypeOfSpawn", error)
        console.error(error)
    }
}

function generateFieldRegionStat(idUser, idGuild){
    try {
        field = [];
        valueMax = 151;
        valueMin = 0;
        if(savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
            if(saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
                field.push({ name: "<:pokeballShinyStar:1005992732541603960>"+language.getText(idGuild,"shinydexDeKanto"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            } else {
                field.push({ name: "<:pokeballLight:981974905568522331>"+language.getText(idGuild,"shinydexDeKanto"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            }
        } else {
            field.push({ name: "<:pokeballDark:981974919212572682>"+language.getText(idGuild,"pokedexDeKanto"), value: savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ savePokemonUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
        }
    
    
        valueMax = 251;
        valueMin = 151;
        if(savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
            if(saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
                field.push({ name: "<:pokeballShinyStar:1005992732541603960>"+language.getText(idGuild,"shinydexDeJohto"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            } else {
                field.push({ name: "<:pokeballLight:981974905568522331>"+language.getText(idGuild,"shinydexDeJohto"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            }
        } else {
            field.push({ name: "<:pokeballDark:981974919212572682>"+language.getText(idGuild,"pokedexDeJohto"), value: savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ savePokemonUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
        }
    
    
        valueMax = 386;
        valueMin = 251;
        if(savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
            if(saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
                field.push({ name: "<:pokeballShinyStar:1005992732541603960>"+language.getText(idGuild,"shinydexDeHoenn"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            } else {
                field.push({ name: "<:pokeballLight:981974905568522331>"+language.getText(idGuild,"shinydexDeHoenn"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            }
        } else {
            field.push({ name: "<:pokeballDark:981974919212572682>"+language.getText(idGuild,"pokedexDeHoenn"), value: savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ savePokemonUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
        }
    
        valueMax = 493;
        valueMin = 386;
        if(savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
            if(saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
                field.push({ name: "<:pokeballShinyStar:1005992732541603960>"+language.getText(idGuild,"shinydexDeSinnoh"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            } else {
                field.push({ name: "<:pokeballLight:981974905568522331>"+language.getText(idGuild,"shinydexDeSinnoh"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            }
        } else {
            field.push({ name: "<:pokeballDark:981974919212572682>"+language.getText(idGuild,"pokedexDeSinnoh"), value: savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ savePokemonUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
        }
    
        valueMax = 649;
        valueMin = 493;
        if(savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
            if(saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
                field.push({ name: "<:pokeballShinyStar:1005992732541603960>"+language.getText(idGuild,"shinydexDeUnys"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            } else {
                field.push({ name: "<:pokeballLight:981974905568522331>"+language.getText(idGuild,"shinydexDeUnys"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            }
        } else {
            field.push({ name: "<:pokeballDark:981974919212572682>"+language.getText(idGuild,"pokedexDeUnys"), value: savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ savePokemonUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
        }

        valueMax = 721;
        valueMin = 649;
        if(savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
            if(saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) == (valueMax-valueMin)){
                field.push({ name: "<:pokeballShinyStar:1005992732541603960>"+language.getText(idGuild,"shinydexDeKalos"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            } else {
                field.push({ name: "<:pokeballLight:981974905568522331>"+language.getText(idGuild,"shinydexDeKalos"), value: saveShinyUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ saveShinyUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
            }
        } else {
            field.push({ name: "<:pokeballDark:981974919212572682>"+language.getText(idGuild,"pokedexDeKalos"), value: savePokemonUser.getCountMaxMin(idUser, valueMax, valueMin) +"/ "+ (valueMax-valueMin) +" - "+ savePokemonUser.getPercentageMaxMin(idUser, valueMax, valueMin)+"%" , inline: true})
        }
    
    
    
    
        return field
    } catch(error) {

        catchError.saveError(idGuild, null, "pokemonController.js", "generateFieldRegionStat", error)
        console.error(error)
    }
}

function generateFiledRandomStat(idUser, idGuild){
    try {
        field = [];
    
        listPokemonUncatch = savePokemonUser.getAllPokemonWithZeroCapture(idUser)
        listPokemonShinyUncatch = saveShinyUser.getAllPokemonWithZeroCapture(idUser)
    
        if(listPokemonUncatch.length <= 0){
            field.push({ name: language.getText(idGuild,"felicitation"), value: language.getText(idGuild,"vousLesAvezTous") , inline: true})
        } else {
            field.push({ name: language.getText(idGuild,"pokemonManquant"), value: pokeDataAll[listPokemonUncatch[fonction.getRandomInt(listPokemonUncatch.length)]]["name"]["name"+ language.getLanguage(idGuild)] , inline: true})
        }
    
        
        if(listPokemonShinyUncatch.length <= 0){
            field.push({ name: language.getText(idGuild,"felicitation"), value: language.getText(idGuild,"vousLesAvezTous") , inline: true})
        } else {
            field.push({ name: language.getText(idGuild,"pokemonManquantShiny"), value: pokeDataAll[listPokemonShinyUncatch[fonction.getRandomInt(listPokemonShinyUncatch.length)]]["name"]["name"+ language.getLanguage(idGuild)] , inline: true})
        }
    
        field.push({ name: language.getText(idGuild,"nombreDeCapture"), value: ""+savePokemonUser.getCountAllPokemon(idUser) , inline: true})
    
        return field
    } catch(error) {

        catchError.saveError(idGuild, null, "pokemonController.js", "generateFiledRandomStat", error)
        console.error(error)
    }
}

/**
 * creer un embed avec la sauvegarde pokemon
 */
 function embedPokemonSaveUser(Discord, interaction, Client, pageChoice){

    try {
        const maxPokemonParPage = 21;
        var listPokemon = [];
        var arrayEmbed = [];
        var savePokemon = savePokemonUser.getSave(interaction.member.id);
        var saveShiny = saveShinyUser.getSave(interaction.member.id);
        const emotePokeballDark = "<:pokeballDark:981974919212572682>";
        const emotePokeballLight = "<:pokeballLight:981974905568522331>";
        const emotePokeballShiny = "<:pokeballShinyStar:1005992732541603960>";
        const emoteMegaDark = "<:MegaVide:1141440546032853062> ";
        const emoteMega = "<:MEGA:1139228792989155359>";
        const emoteMegaShiny = "<:shinyMega:1141440293409923123>";
        var pageDeBase
    
        
    
        if(savePokemon === undefined){
            savePokemonUser.createSaveUser(interaction.member.id)
            savePokemonUser.updateNumberPossibilitySave(interaction.member.id)
            savePokemon = savePokemonUser.getSave(interaction.member.id);
        }
        let pokeSave
        nbPage = 1;
        nbPageMax = 1;
        while(pokemonObject.getNamePokemon(1+maxPokemonParPage*(nbPageMax), interaction.guild.id) !== null){
            nbPageMax++
        }
    
        nbPageMax++
    
        if(isNaN(Number(pageChoice))){
            interaction.channel.send(language.getText(interaction.guild.id, "ilFautUnNombre"))
            pageDeBase = 1
        } else if(pageChoice > nbPageMax){
            interaction.channel.send(language.getText(interaction.guild.id, "valeurTropHaute"))
            pageDeBase = 1
        } else{
            pageDeBase = pageChoice
        }
    
        mainPage = new Discord.EmbedBuilder();
        mainPage
        .setThumbnail(interaction.member.avatarURL())
                .setColor("#0099FF")
                .setDescription("\u200B")
                .setTitle(language.getText(interaction.guild.id, "pokedexOf") + interaction.member.user.username)
                .addFields(
                    { name: language.getText(interaction.guild.id, "nationalDex"), value: savePokemonUser.getCountNational(interaction.member.id)+"/"+ (pokeDataAll.length-1)+" - "+ savePokemonUser.getPercentageNational(interaction.member.id)+"%" , inline: true},
                    { name: language.getText(interaction.guild.id, "shinyDex"), value: saveShinyUser.getCountNational(interaction.member.id)+"/"+ (pokeDataAll.length-1)+" - "+ saveShinyUser.getPercentageNational(interaction.member.id)+"%" , inline: true},
                    { name: language.getText(interaction.guild.id, "nationalDexServer"), value: savePokemonServer.getCountNational(interaction.guild.id)+"/"+ (pokeDataAll.length-1)+" - "+ savePokemonServer.getPercentageNational(interaction.guild.id)+"%" , inline: true},
                    { name: "\u200B", value: "\u200B" , inline: false}
                )
                .addFields(
                    generateFieldRegionStat(interaction.member.id, interaction.guild.id)
                )
                .addFields({ name: "\u200B", value: "\u200B" , inline: false})
                .addFields(
                    generateFiledRandomStat(interaction.member.id, interaction.guild.id)
                )
                .setFooter({text: "Pages:  "+ nbPage + "/" + nbPageMax +"."})
    
    
            arrayEmbed.push({page : mainPage})
        
        nbPage++;
        while(pokemonObject.getNamePokemon(1+maxPokemonParPage*(nbPage-2), interaction.guild.id) !== null){
            pokeSave = new Discord.EmbedBuilder()
    
            
            for (let i = 1+maxPokemonParPage*(nbPage-2); i <= maxPokemonParPage*(nbPage-1); i++){
    
                pokeFields = {};
                if(pokemonObject.getNamePokemon(i, interaction.guild.id) != null){
                    
                    if(saveShiny[i] === 0){
                        if(savePokemon[i] === 0){
                            pokeFields = { name: i+" ?????  "+ emotePokeballDark, value: language.getText(interaction.guild.id, "noCatch") , inline: true}
                        } else {
                            pokeFields = { name: i+" "+pokemonObject.getNamePokemon(i, interaction.guild.id)+"  "+emotePokeballLight, value: language.getText(interaction.guild.id, "catched")+ savePokemon[i] , inline: true}
                        }
                    } else {
                        pokeFields = { name: i+" "+pokemonObject.getNamePokemon(i, interaction.guild.id)+"  "+emotePokeballShiny, value: language.getText(interaction.guild.id, "catched")+ savePokemon[i] , inline: true}
                    }

                    saveMega = pokemonForm.getSaveByForm(interaction.member.id, "mega")
                    if(saveMega.hasOwnProperty(i+"")){
                        
                        if(saveMega[i]["normal"] === 0){
                            pokeFields.name += emoteMegaDark
                        } else {
                            if(saveMega[i]["shiny"] === 0){
                                pokeFields.name += emoteMega
                            } else {
                                pokeFields.name += emoteMegaShiny
                            }

                        }
                    }
        
                    
                    listPokemon.push(pokeFields)
                }
            }
    
            
            var sautLigne = [
                { name: '\u200B', value: '\u200B' },
            ]
        
            
            pokeSave
                .setThumbnail(interaction.member.avatarURL())
                .setColor("#0099FF")
                .setDescription("\u200B")
                .setTitle(language.getText(interaction.guild.id, "pokedexOf") + interaction.member.user.username)
                .addFields(
                    { name: language.getText(interaction.guild.id, "nationalDex"), value: savePokemonUser.getCountNational(interaction.member.id)+"/"+ (pokeDataAll.length-1)+" - "+ savePokemonUser.getPercentageNational(interaction.member.id)+"%" , inline: true},
                    { name: language.getText(interaction.guild.id, "shinyDex"), value: saveShinyUser.getCountNational(interaction.member.id)+"/"+ (pokeDataAll.length-1)+" - "+ saveShinyUser.getPercentageNational(interaction.member.id)+"%" , inline: true},
                    { name: "\u200B", value: "\u200B" , inline: false}
                )
                .addFields(listPokemon)
                .setFooter({text: "Pages:  "+ nbPage + "/" + nbPageMax +"."})
     
            listPokemon = [];
            nbPage++;
            arrayEmbed.push({page : pokeSave})
           
        }
        

        pagination.paginationButton(interaction, arrayEmbed);
    
    } catch(error) {

        catchError.saveError(interaction.guild.id, interaction.channel.id, "pokemonController.js", "embedPokemonSaveUser", error)
        console.error(error)
    }
}

/**
 * @param {Discord} Discord 
 * @param {*} interaction 
 * @param {*} Client 
 * @param {*} pokemonName 
 * @param {*} pokemonId 
 * @returns 
 */

function howThisPokemon(Discord, interaction, pokemonName, pokemonId){

    try {
        var idPokemon = null;
        if(pokemonName !== false){
    
            pokeDataAll.forEach(pokemon => {
                if((pokemon.name.nameEng.toLowerCase() === pokemonName.toLowerCase() || 
                    pokemon.name.nameFr.toLowerCase() === pokemonName.toLowerCase()) &&
                    pokemon.id !== 0){

                    idPokemon = pokemon.id
                }
    
            })
    
            if(idPokemon == null){
                interaction.channel.send(language.getText(interaction.guild.id, "notExist"))
                return
            }
    
        } else if(pokemonId !== false){
            if(pokeDataAll[pokemonId] === undefined || pokemonId == 0){
                interaction.channel.send(language.getText(interaction.guild.id, "notExist"))
                return
            }
            idPokemon = pokemonId;
        } else {
            interaction.channel.send(language.getText(interaction.guild.id, "noArgument"))
            return
        }
        
        let arrayPagination = [];
        arrayPokemonValide = [];

        pokeDataAll.forEach(pokemon => {
            if(pokemon.id == idPokemon){
                arrayPokemonValide.push(pokemon)
            }
        })
        firstPokemonValid = arrayPokemonValide[0]

        if(arrayPokemonValide.length > 1){
            for(let i = 1; i < arrayPokemonValide.length; i++){
                arrayPokemonValide[i]["imgName"].forEach(imgName => {
                    firstPokemonValid["imgName"].push(JSON.parse(JSON.stringify(imgName)))
                })
                variableGlobal.form.forEach(form => {
                    arrayPokemonValide[i]["pokemonForm"][form].forEach(pokemonForm => {
                        firstPokemonValid["pokemonForm"][form].push(pokemonForm)
                    })
                })
            }
        }
    
        const actualPokemon = firstPokemonValid
    
        let embed
        var adressImage;
        
        if(savePokemonUser.getNumberCapturePokemon(interaction.member.id, idPokemon) >0){
            actualPokemon["imgName"].forEach(imgName => {
                embed = new Discord.EmbedBuilder()
                //.setColor(fonction.colorByType(actualPokemon["typeListEng"][fonction.getRandomInt(actualPokemon["typeListEng"].length)]))
                .setTitle(actualPokemon["name"]['name'+language.getLanguage(interaction.guild.id)])
                .setImage("attachment://"+ JSON.parse(JSON.stringify(imgName)) + ".png")
                .setThumbnail(interaction.member.avatarURL())
                .addFields(
                    { name: language.getText(interaction.guild.id, "nombreDeCapture"), value: ""+savePokemonUser.getNumberCapturePokemon(interaction.member.id, idPokemon) , inline: true},
                    { name: language.getText(interaction.guild.id, "nombreDeCaptureShiny"), value: ""+saveShinyUser.getNumberCapturePokemon(interaction.member.id, idPokemon) , inline: true},
                    { name: language.getText(interaction.guild.id, "nombreDeCaptureDuServer"), value: ""+saveShinyUser.getNumberCapturePokemon(interaction.member.id, idPokemon) , inline: false},
                    { name: language.getText(interaction.guild.id, "nombreDeCaptureTotaly"), value: ""+stat.getCount(true, false, false)[idPokemon] , inline: false},
                    { name: language.getText(interaction.guild.id, "nombreDeCaptureShinyTotaly"), value: ""+stat.getCount(true, false, true)[idPokemon] , inline: true},
                    { name: language.getText(interaction.guild.id, "nombreDeSpawnTotaly"), value: ""+stat.getCount(true, true, false)[idPokemon] , inline: true},
                    { name: language.getText(interaction.guild.id, "nombreDeSpawnShinyTotaly"), value: ""+stat.getCount(true, true, true)[idPokemon] , inline: true}
                )
                .setColor(fonction.colorByType(actualPokemon["typeListEng"][fonction.getRandomInt(actualPokemon["typeListEng"].length)]))
                
                if(eventStatChange.getGeneralStat(interaction.guild.id, "nightMode")){
                    adressImage = "./src/image/pokeHomeShadow/"+JSON.parse(JSON.stringify(imgName))+".png";
                } else {
                    adressImage = "./src/image/pokeHome/"+JSON.parse(JSON.stringify(imgName))+".png";
                }
                arrayPagination.push({page: embed, imagePage: adressImage})
                
            })
            
            if(saveShinyUser.getNumberCapturePokemon(interaction.member.id, idPokemon) >0){
    
                actualPokemon["imgName"].forEach(imgName => {
                    embed = new Discord.EmbedBuilder()
                    //.setColor(fonction.colorByType(actualPokemon["typeListEng"][fonction.getRandomInt(actualPokemon["typeListEng"].length)]))
                    .setTitle(actualPokemon["name"]['name'+language.getLanguage(interaction.guild.id)])
                    .setImage("attachment://"+ JSON.parse(JSON.stringify(imgName)) + "-shiny.png")
                    .setThumbnail(interaction.member.avatarURL())
                    .addFields(
                        { name: language.getText(interaction.guild.id, "nombreDeCapture"), value: ""+savePokemonUser.getNumberCapturePokemon(interaction.member.id, idPokemon) , inline: true},
                        { name: language.getText(interaction.guild.id, "nombreDeCaptureShiny"), value: ""+saveShinyUser.getNumberCapturePokemon(interaction.member.id, idPokemon) , inline: true},
                        { name: language.getText(interaction.guild.id, "nombreDeCaptureDuServer"), value: ""+saveShinyUser.getNumberCapturePokemon(interaction.member.id, idPokemon) , inline: false},
                        { name: language.getText(interaction.guild.id, "nombreDeCaptureTotaly"), value: ""+stat.getCount(true, false, false)[idPokemon] , inline: false},
                        { name: language.getText(interaction.guild.id, "nombreDeCaptureShinyTotaly"), value: ""+stat.getCount(true, false, true)[idPokemon] , inline: true},
                        { name: language.getText(interaction.guild.id, "nombreDeSpawnTotaly"), value: ""+stat.getCount(true, true, false)[idPokemon] , inline: true},
                        { name: language.getText(interaction.guild.id, "nombreDeSpawnShinyTotaly"), value: ""+stat.getCount(true, true, true)[idPokemon] , inline: true}
    
                    )
                    .setColor(fonction.colorByType(actualPokemon["typeListEng"][fonction.getRandomInt(actualPokemon ["typeListEng"].length)]))
                    
                    if(eventStatChange.getGeneralStat(interaction.guild.id, "nightMode")){
                        adressImage = "./src/image/pokeHomeShadow/"+JSON.parse(JSON.stringify(imgName))+"-shiny.png";
                    } else {
                        adressImage = "./src/image/pokeHome/"+JSON.parse(JSON.stringify(imgName))+"-shiny.png";
                    }

                    arrayPagination.push({page: embed, imagePage: adressImage})
                    
                    })
            }

            //list des form
            variableGlobal.form.forEach(form => {
                //vérif si le pokemon a la form
                if(actualPokemon.pokemonForm.hasOwnProperty(form)){
                    saveForm = pokemonForm.getSaveByForm(interaction.member.id, form)
                    //vérif si l'utilisateur à déjà attrapé le pokemon de cette form
                    if(saveForm[actualPokemon["id"]]["normal"] > 0){
                        //List les variation de la même form (genre tauros de paldea)
                        actualPokemon.pokemonForm[form].forEach(pokemonForm => {
                            // List les variation dans la variation (genre male et femelle)
                            //qui chez gamefreak trouve ça drole ? fdp va
                            pokemonForm["imgName"].forEach(imgName => {

                                embed = new Discord.EmbedBuilder()
                                
                                .setTitle(actualPokemon["name"]['name'+language.getLanguage(interaction.guild.id)])
                                .setImage("attachment://"+ JSON.parse(JSON.stringify(imgName)) + ".png")
                                .setThumbnail(interaction.member.avatarURL())
                                .addFields(
                                    { name: language.getText(interaction.guild.id, "nombreDeCapture"), value: ""+saveForm[actualPokemon["id"]]["normal"] , inline: true},
                                    { name: language.getText(interaction.guild.id, "nombreDeCaptureShiny"), value: ""+saveForm[actualPokemon["id"]]["shiny"] , inline: true},
                                    //{ name: language.getText(interaction.guild.id, "nombreDeCaptureDuServer"), value: ""+saveShinyUser.getNumberCapturePokemon(interaction.member.id, idPokemon) , inline: false},
                                    { name: language.getText(interaction.guild.id, "nombreDeCaptureTotaly"), value: ""+stat.getCount(true, false, false)[idPokemon] , inline: false},
                                    { name: language.getText(interaction.guild.id, "nombreDeCaptureShinyTotaly"), value: ""+stat.getCount(true, false, true)[idPokemon] , inline: true},
                                    { name: language.getText(interaction.guild.id, "nombreDeSpawnTotaly"), value: ""+stat.getCount(true, true, false)[idPokemon] , inline: true},
                                    { name: language.getText(interaction.guild.id, "nombreDeSpawnShinyTotaly"), value: ""+stat.getCount(true, true, true)[idPokemon] , inline: true}
                
                                )
                                .setColor(fonction.colorByType(actualPokemon["typeListEng"][fonction.getRandomInt(actualPokemon ["typeListEng"].length)]))
                                
                                if(eventStatChange.getGeneralStat(interaction.guild.id, "nightMode")){
                                    adressImage = "./src/image/pokeHomeShadow/"+JSON.parse(JSON.stringify(imgName))+".png";
                                } else {
                                    adressImage = "./src/image/pokeHome/"+JSON.parse(JSON.stringify(imgName))+".png";
                                }
                                arrayPagination.push({page: embed, imagePage: adressImage})
                                

                            })
                        })
                    }
                    if(saveForm[actualPokemon["id"]]["shiny"] > 0){
                        //List les variation de la même form (genre tauros de paldea)
                        actualPokemon.pokemonForm[form].forEach(pokemonForm => {
                            // List les variation dans la variation (genre male et femelle)
                            //qui chez gamefreak trouve ça drole ? fdp va
                            //MAIS EN SHINY
                            pokemonForm["imgName"].forEach(imgName => {

                                embed = new Discord.EmbedBuilder()
                                
                                .setTitle(actualPokemon["name"]['name'+language.getLanguage(interaction.guild.id)])
                                .setImage("attachment://"+ JSON.parse(JSON.stringify(imgName)) + "-shiny.png")
                                .setThumbnail(interaction.member.avatarURL())
                                .addFields(
                                    { name: language.getText(interaction.guild.id, "nombreDeCapture"), value: ""+saveForm[actualPokemon["id"]]["normal"] , inline: true},
                                    { name: language.getText(interaction.guild.id, "nombreDeCaptureShiny"), value: ""+saveForm[actualPokemon["id"]]["shiny"] , inline: true},
                                    //{ name: language.getText(interaction.guild.id, "nombreDeCaptureDuServer"), value: ""+saveShinyUser.getNumberCapturePokemon(interaction.member.id, idPokemon) , inline: false},
                                    { name: language.getText(interaction.guild.id, "nombreDeCaptureTotaly"), value: ""+stat.getCount(true, false, false)[idPokemon] , inline: false},
                                    { name: language.getText(interaction.guild.id, "nombreDeCaptureShinyTotaly"), value: ""+stat.getCount(true, false, true)[idPokemon] , inline: true},
                                    { name: language.getText(interaction.guild.id, "nombreDeSpawnTotaly"), value: ""+stat.getCount(true, true, false)[idPokemon] , inline: true},
                                    { name: language.getText(interaction.guild.id, "nombreDeSpawnShinyTotaly"), value: ""+stat.getCount(true, true, true)[idPokemon] , inline: true}
                
                                )
                                .setColor(fonction.colorByType(actualPokemon["typeListEng"][fonction.getRandomInt(actualPokemon ["typeListEng"].length)]))
                                
                                if(eventStatChange.getGeneralStat(interaction.guild.id, "nightMode")){
                                    adressImage = "./src/image/pokeHomeShadow/"+JSON.parse(JSON.stringify(imgName))+"-shiny.png";
                                } else {
                                    adressImage = "./src/image/pokeHome/"+JSON.parse(JSON.stringify(imgName))+"-shiny.png";
                                }
                                arrayPagination.push({page: embed, imagePage: adressImage})
                                

                            })
                        })
                    }
                }
            })

        } else {
    
    
            embed = new Discord.EmbedBuilder()
            .setTitle(actualPokemon["name"]['name'+language.getLanguage(interaction.guild.id)])
            .setImage("attachment://0000-001.png")
            .setThumbnail(interaction.member.avatarURL())
            .addFields(
                { name: language.getText(interaction.guild.id, "nombreDeCapture"), value: ""+savePokemonUser.getNumberCapturePokemon(interaction.member.id, idPokemon) , inline: true},
                { name: language.getText(interaction.guild.id, "nombreDeCaptureShiny"), value: ""+saveShinyUser.getNumberCapturePokemon(interaction.member.id, idPokemon) , inline: true},
                { name: language.getText(interaction.guild.id, "nombreDeCaptureDuServer"), value: ""+saveShinyUser.getNumberCapturePokemon(interaction.member.id, idPokemon) , inline: false},
                { name: language.getText(interaction.guild.id, "nombreDeCaptureTotaly"), value: ""+stat.getCount(true, false, false)[idPokemon] , inline: false},
                { name: language.getText(interaction.guild.id, "nombreDeCaptureShinyTotaly"), value: ""+stat.getCount(true, false, true)[idPokemon] , inline: true},
                { name: language.getText(interaction.guild.id, "nombreDeSpawnTotaly"), value: ""+stat.getCount(true, true, false)[idPokemon] , inline: true},
                { name: language.getText(interaction.guild.id, "nombreDeSpawnShinyTotaly"), value: ""+stat.getCount(true, true, true)[idPokemon] , inline: true}
    
            )

            if(eventStatChange.getGeneralStat(interaction.guild.id, "nightMode")){
                adressImage = "./src/image/pokeHomeShadow/0000-001.png";
            } else {
                adressImage = "./src/image/pokeHome/0000-001.png";
            }
    
            arrayPagination.push({page: embed, imagePage: adressImage})
            
        }

        let count = 0;
        let countTotal = arrayPagination.length;

        arrayPagination.forEach(page => {
            count++;
            page.page.setFooter({text: "Pages:  "+ count + "/" + countTotal +"."})
        })
    
        pagination.paginationButton(interaction,arrayPagination, 1, 60000)
    
    } catch(error) {

        catchError.saveError(interaction.guild.id, interaction.channel.id, "pokemonController.js", "howThisPokemon", error)
        console.error(error)
    }
}

module.exports= { spawnPokemon, embedPokemonSaveUser, catchPokemon, howThisPokemon}