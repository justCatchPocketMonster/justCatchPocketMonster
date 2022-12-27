const { AttachmentBuilder, Client, ButtonInteraction } = require("discord.js")
const Discord = require("discord.js")
const variableGlobal = require("../parameters/variableGlobal")
const stat = require("../fonction/stat")
const pokeData = require("../bdd/pokemon.json");
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

const pagination = require("./pagination")

const prefix = variableGlobal.prefix;
var pokemon = undefined;



/**
 * 
 * creer un embed avec les informations d'un pokemon
 */
function embedPokemon(Discord, message, pokemon, Client, idChannel, isShiny){

    let imageRandom = fonction.getRandomInt(pokemon["imgName"].length);
    if(pokemon["isShiny"]){
        
        var adressImage = "./src/image/pokeHome/"+pokemon["imgName"][imageRandom]+"-shiny.png";
        var nameImage = pokemon["imgName"][imageRandom] + "-shiny.png";
    } else {
        var adressImage = "./src/image/pokeHome/"+pokemon["imgName"][imageRandom]+".png";
        var nameImage = pokemon["imgName"][imageRandom] + ".png";
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
}

/**
 * 
 * @param {*} Discord 
 * @param {*} message 
 * @param {*} Client 
 */
function spawnPokemon(Discord, message, Client){
    let messageEnvoyer = message.content;
    let idServer = message.guild.id;
    let idChannel = message.channel.id;
    
    
    if(spawnCount.getCount(idServer, idChannel) === 0){
        spawnCount.setMaxRandom(idServer, idChannel)
    }
    if (spawnCount.getCount(idServer, idChannel) != null){
        spawnCount.setCount(idServer, spawnCount.getCount(idServer, idChannel)+1, idChannel)
    }
    
    if(spawnCount.getCount(idServer, idChannel) >= spawnCount.getMaxRandom(idServer, idChannel)){
        idChannelRandom = allowChannel.randomIdServer(message.guild.id)
        
        
        
        choiceTypeOfSpawn(Discord, message, spawnCount.getPokemonPresent(idServer, idChannelRandom), Client, idChannelRandom, idServer);
        stat.statAddSpawn(spawnCount.getPokemonPresent(idServer, idChannelRandom)["id"], spawnCount.getPokemonPresent(idServer, idChannelRandom)["isShiny"]);
        spawnCount.setCount(idServer, 0, idChannel)
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

    let messageEnvoyer = optionString;
    let idServer = interaction.guild.id;
    let idChannel = interaction.channel.id;

    
    if((messageEnvoyer.toLowerCase() === spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameFr"].toLowerCase()) || 
        messageEnvoyer.toLowerCase() === spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameEng"].toLowerCase()){

            savePokemonUser.pokedex(spawnCount.getPokemonPresent(idServer, idChannel)["id"], interaction.member.id)
            savePokemonServer.pokedex(spawnCount.getPokemonPresent(idServer, idChannel)["id"], interaction.guild.id)

            if(spawnCount.getPokemonPresent(idServer, idChannel)["isShiny"]){
                saveShinyUser.pokedex(spawnCount.getPokemonPresent(idServer, idChannel)["id"], interaction.member.id)
            }
            stat.statAddCatch(spawnCount.getPokemonPresent(idServer, idChannel)["id"], spawnCount.getPokemonPresent(idServer, idChannel)["isShiny"])
            if(spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameFr"] != spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameEng"]){
                let messageCongratSend = language.getText(interaction.guild.id, "congratYouCatchPart1")+interaction.user.username+language.getText(interaction.guild.id, "congratYouCatchPart2")+ spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameFr"] +"/"+ spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameEng"];
                if(spawnCount.getPokemonPresent(idServer, idChannel)["isShiny"]){
                    messageCongratSend += ":star:. "
                } else {
                    messageCongratSend += ". "
                }
                if(savePokemonUser.getNumberCapturePokemon(interaction.member.id, spawnCount.getPokemonPresent(idServer, idChannel)["id"]) == 1){
                    messageCongratSend += language.getText(interaction.guild.id, "newAtPokedex")

                }

                interaction.channel.send(messageCongratSend)
                
            }else{
                let messageCongratSend = language.getText(interaction.guild.id, "congratYouCatchPart1")+interaction.user.username+language.getText(interaction.guild.id, "congratYouCatchPart2")+ spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameFr"];
                if(spawnCount.getPokemonPresent(idServer, idChannel)["isShiny"]){
                    messageCongratSend += ":star:. "
                } else {
                    messageCongratSend += ". "
                }
                
                if(savePokemonUser.getNumberCapturePokemon(interaction.member.id, spawnCount.getPokemonPresent(idServer, idChannel)["id"]) == 1){
                    messageCongratSend += language.getText(interaction.guild.id, "newAtPokedex")

                }

                interaction.channel.send(messageCongratSend)
            }

            spawnCount.setPokemonPresent(idServer,null, idChannel);
            return
        } else {
            interaction.channel.send(language.getText(interaction.guild.id, "noPokemonDisponible"))
            return
        }


        
}


function choiceTypeOfSpawn(Discord, message, pokemon, Client, idChannelRandom, idServer){
    /** 
    nbRand = fonction.getRandomInt(variableGlobal.valeurMaxChoiceEvent)
    
    if(variableGlobal.valeurMaxEvent>= nbRand){
        console.log("but nobody came")

    } else {
        */
        pokemon = pokemonObject.pokemonSelect();

        pokemon = pokemonObject.shinySelect(pokemon, idServer, message);
        pokemon["capturable"] = true;
        spawnCount.setPokemonPresent(idServer, pokemon, idChannelRandom);
        embedPokemon(Discord, message, pokemon, Client, idChannelRandom)
        pokemonSpawnFollow.addPokemon(pokemon);
    //}

}

function generateFieldRegionStat(idUser, idGuild){
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




    return field
}

function generateFiledRandomStat(idUser, idGuild){
    field = [];

    listPokemonUncatch = savePokemonUser.getAllPokemonWithZeroCapture(idUser)
    listPokemonShinyUncatch = saveShinyUser.getAllPokemonWithZeroCapture(idUser)

    if(listPokemonUncatch.length <= 0){
        field.push({ name: language.getText(idGuild,"felicitation"), value: language.getText(idGuild,"vousLesAvezTous") , inline: true})
    } else {
        field.push({ name: language.getText(idGuild,"pokemonManquant"), value: pokeData[listPokemonUncatch[fonction.getRandomInt(listPokemonUncatch.length)]]["name"]["name"+ language.getLanguage(idGuild)] , inline: true})
    }

    
    if(listPokemonShinyUncatch.length <= 0){
        field.push({ name: language.getText(idGuild,"felicitation"), value: language.getText(idGuild,"vousLesAvezTous") , inline: true})
    } else {
        field.push({ name: language.getText(idGuild,"pokemonManquant")+ " shiny", value: pokeData[listPokemonShinyUncatch[fonction.getRandomInt(listPokemonShinyUncatch.length)]]["name"]["name"+ language.getLanguage(idGuild)] , inline: true})
    }

    field.push({ name: language.getText(idGuild,"nombreDeCapture"), value: ""+savePokemonUser.getCountAllPokemon(idUser) , inline: true})

    return field
}

/**
 * creer un embed avec la sauvegarde pokemon
 */
 function embedPokemonSaveUser(Discord, interaction, Client, pageChoice){

    const maxPokemonParPage = 21;
    var listPokemon = [];
    var arrayEmbed = [];
    var savePokemon = savePokemonUser.getSave(interaction.member.id);
    var saveShiny = saveShinyUser.getSave(interaction.member.id);
    const emotePokeballDark = "<:pokeballDark:981974919212572682>";
    const emotePokeballLight = "<:pokeballLight:981974905568522331>";
    const emotePokeballShiny = "<:pokeballShinyStar:1005992732541603960>";
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
                { name: language.getText(interaction.guild.id, "nationalDex"), value: savePokemonUser.getCountNational(interaction.member.id)+"/"+ (pokeData.length-1)+" - "+ savePokemonUser.getPercentageNational(interaction.member.id)+"%" , inline: true},
                { name: language.getText(interaction.guild.id, "shinyDex"), value: saveShinyUser.getCountNational(interaction.member.id)+"/"+ (pokeData.length-1)+" - "+ saveShinyUser.getPercentageNational(interaction.member.id)+"%" , inline: true},
                { name: language.getText(interaction.guild.id, "nationalDexServer"), value: savePokemonServer.getCountNational(interaction.guild.id)+"/"+ (pokeData.length-1)+" - "+ savePokemonServer.getPercentageNational(interaction.guild.id)+"%" , inline: true},
                { name: "\u200B", value: "\u200B" , inline: false}
            )
            .addFields(
                generateFieldRegionStat(interaction.member.id, interaction.guild.id),
                { name: "\u200B", value: "\u200B" , inline: false}
            )
            .addFields(
                generateFiledRandomStat(interaction.member.id, interaction.guild.id)
            )
            .setFooter({text: "Pages:  "+ nbPage + "/" + nbPageMax +"."})



        arrayEmbed.push(mainPage)
    
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
                { name: language.getText(interaction.guild.id, "nationalDex"), value: savePokemonUser.getCountNational(interaction.member.id)+"/"+ (pokeData.length-1)+" - "+ savePokemonUser.getPercentageNational(interaction.member.id)+"%" , inline: true},
                { name: language.getText(interaction.guild.id, "shinyDex"), value: saveShinyUser.getCountNational(interaction.member.id)+"/"+ (pokeData.length-1)+" - "+ saveShinyUser.getPercentageNational(interaction.member.id)+"%" , inline: true},
                { name: "\u200B", value: "\u200B" , inline: false}
            )
            .addFields(listPokemon)
            .setFooter({text: "Pages:  "+ nbPage + "/" + nbPageMax +"."})
 
        listPokemon = [];
        nbPage++;
        arrayEmbed.push(pokeSave)
       
    }
    
    
    pagination(interaction, ButtonInteraction, arrayEmbed, pageDeBase);

    
}

module.exports= { spawnPokemon, embedPokemonSaveUser, catchPokemon}