const { MessageAttachment, Client } = require("discord.js")
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
    
    let pokeImg = new MessageAttachment(adressImage)

    
    let pokeEmbed = new Discord.MessageEmbed()
        .setColor(fonction.colorByType(pokemon["typeListEng"][fonction.getRandomInt(pokemon["typeListEng"].length)]))
        .setTitle(language.getText(message.guild.id, "embedPokemonTitle"))
        .setDescription(language.getText(message.guild.id, "embedPokemonDescription"))
        //.attachFiles(pokeImg);
        .setImage("attachment://"+ nameImage)

    Client.channels.cache.get(idChannel).send({ embeds: [pokeEmbed], files: [pokeImg]});
    return(pokemon["id"])
}

/**
 * Permet la capture d'un pokemon
 */
function spawnPokemon(Discord, message, Client){
    let messageEnvoyer = message.content;
    let idServer = message.guild.id;
    let idChannel = message.channel.id;
    if(spawnCount.getPokemonPresent(idServer,idChannel) != null && spawnCount.getPokemonPresent(idServer,idChannel)["capturable"] === true){
        if((messageEnvoyer.toLowerCase() === prefix + "catch "+ spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameFr"].toLowerCase()) || 
        messageEnvoyer.toLowerCase() === prefix + "catch "+ spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameEng"].toLowerCase()){

            savePokemonUser.pokedex(spawnCount.getPokemonPresent(idServer, idChannel)["id"], message.member.id)
            savePokemonServer.pokedex(spawnCount.getPokemonPresent(idServer, idChannel)["id"], message.guild.id)

            if(spawnCount.getPokemonPresent(idServer, idChannel)["isShiny"]){
                saveShinyUser.pokedex(spawnCount.getPokemonPresent(idServer, idChannel)["id"], message.member.id)
            }
            stat.statAddCatch(spawnCount.getPokemonPresent(idServer, idChannel)["id"], spawnCount.getPokemonPresent(idServer, idChannel)["isShiny"])
            if(spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameFr"] != spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameEng"]){
                let messageCongratSend = language.getText(message.guild.id, "congratYouCatchPart1")+message.author.username+language.getText(message.guild.id, "congratYouCatchPart2")+ spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameFr"] +"/"+ spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameEng"];
                if(spawnCount.getPokemonPresent(idServer, idChannel)["isShiny"]){
                    messageCongratSend += ":star:. "
                } else {
                    messageCongratSend += ". "
                }
                if(savePokemonUser.getNumberCapturePokemon(message.member.id, spawnCount.getPokemonPresent(idServer, idChannel)["id"]) == 1){
                    messageCongratSend += language.getText(message.guild.id, "newAtPokedex")

                }

                message.channel.send(messageCongratSend)
                
            }else{
                let messageCongratSend = language.getText(message.guild.id, "congratYouCatchPart1")+message.author.username+language.getText(message.guild.id, "congratYouCatchPart2")+ spawnCount.getPokemonPresent(idServer, idChannel)["name"]["nameFr"];
                if(spawnCount.getPokemonPresent(idServer, idChannel)["isShiny"]){
                    messageCongratSend += ":star:. "
                } else {
                    messageCongratSend += ". "
                }
                
                if(savePokemonUser.getNumberCapturePokemon(message.member.id, spawnCount.getPokemonPresent(idServer, idChannel)["id"]) == 1){
                    messageCongratSend += language.getText(message.guild.id, "newAtPokedex")

                }

                message.channel.send(messageCongratSend)
            }

            spawnCount.setPokemonPresent(idServer,null, idChannel);
            return

        }else if(messageEnvoyer.substring(0,(prefix+"catch").length) === prefix + "catch"){

            message.channel.send(language.getText(message.guild.id, "failCatchGoodPokemon"))
            return
            
        }
    }else {
        if(messageEnvoyer.substring(0,(prefix+"catch").length) === prefix + "catch"){
            
            message.channel.send(language.getText(message.guild.id, "noPokemonDisponible"))
            return
        }
    }

    
    
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
    //}

    


    
}

/**
 * creer un embed avec la sauvegarde pokemon
 */
 function embedPokemonSaveUser(Discord, message, nbPage, Client){
    const maxPokemonParPage = 21;
    var listPokemon = []
    var savePokemon = savePokemonUser.getSave(message.member.id);
    var saveShiny = saveShinyUser.getSave(message.member.id);
    const emotePokeballDark = "<:pokeballDark:981974919212572682>";
    const emotePokeballLight = "<:pokeballLight:981974905568522331>";
    const emotePokeballShiny = "<:pokeballShinyStar:1005992732541603960>";

    if(savePokemon === undefined){
        savePokemonUser.createSaveUser(message.member.id)
        savePokemonUser.updateNumberPossibilitySave(message.member.id)
        savePokemon = savePokemonUser.getSave(message.member.id);
    }
    
    for (let i = 1+maxPokemonParPage*(nbPage-1); i < maxPokemonParPage*nbPage+1; i++){
        pokeFields = {};
        if(pokemonObject.getNamePokemon(i, message.guild.id) != null){
            
            if(saveShiny[i] === 0){
                if(savePokemon[i] === 0){
                    pokeFields = { name: i+" ?????  "+ emotePokeballDark, value: language.getText(message.guild.id, "noCatch") , inline: true}
                } else {
                    pokeFields = { name: i+" "+pokemonObject.getNamePokemon(i, message.guild.id)+"  "+emotePokeballLight, value: language.getText(message.guild.id, "catched")+ savePokemon[i] , inline: true}
                }
            } else {
                pokeFields = { name: i+" "+pokemonObject.getNamePokemon(i, message.guild.id)+"  "+emotePokeballShiny, value: language.getText(message.guild.id, "catched")+ savePokemon[i] , inline: true}
            }

            
            listPokemon.push(pokeFields)
        }
    }
    

    
    
    var sautLigne = [
        { name: '\u200B', value: '\u200B' },
    ]

    if(pokemonObject.getNamePokemon(1+maxPokemonParPage*(nbPage-1), message.guild.id) === null){
        message.channel.send(language.getText(message.guild.id, "noPage"))
    } else {
        let pokeSave = new Discord.MessageEmbed()
            .setThumbnail(message.author.avatarURL())
            .setColor("#0099FF")
            .setTitle(language.getText(message.guild.id, "pokedexOf") + message.author.username)
            .addFields(
                { name: language.getText(message.guild.id, "nationalDex"), value: savePokemonUser.getCountNational(message.member.id)+"/"+ (pokeData.length-1)+" - "+ savePokemonUser.getPercentageNational(message.member.id)+"%" },
                { name: language.getText(message.guild.id, "shinyDex"), value: saveShinyUser.getCountNational(message.member.id)+"/"+ (pokeData.length-1)+" - "+ saveShinyUser.getPercentageNational(message.member.id)+"%" }
            )
            .addFields(listPokemon)

            message.channel.send({ embeds: [pokeSave]});
    }
}

module.exports= { spawnPokemon, embedPokemonSaveUser}