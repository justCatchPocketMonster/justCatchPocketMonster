const codeEntered = require("../bdd/enteredCode.json")
const language = require("../fonction/language")
const pokemonObject = require("../object/PokemonObject")
const savePokemonUser = require("./pokedexSaveUser")
const saveShinyUser = require("./shinydexSaveUser")
const fs = require("fs");

//Les codes
const code1 = "LeBotADesBugs"
const code2 = "5000SPAWNS"
const code3 = "10000SPAWNS"


async function enterCode(idUser, code, message){
    if(codeEntered[idUser] === undefined){
        createUser(idUser)
        SaveBdd();
    }
    codeHasEffect(idUser, code, message)
}

function createUser(idUser){
    codeEntered[idUser] = []
    return
}

async function codeHasEffect (idUser, code, message){
    switch(code){
        case code1:
        case code2:
        case code3:
            if(codeEntered[idUser].includes(code)){
                message.channel.send(language.getText(message.guild.id, "codeAlreadyUsed"));
            } else {
                effectCode1(idUser, message);
                codeEntered[idUser].push(code);
            }
            SaveBdd();
            return
            break;
        default:
            message.channel.send(language.getText(message.guild.id, "codeDontExist"));
    }
}

/**
 * sert a donné un pokemon shiny
 */
function effectCode1(idUser, message){
    pokemon = pokemonObject.pokemonSelect();

    savePokemonUser.pokedex(pokemon["id"], idUser)
    saveShinyUser.pokedex(pokemon["id"], idUser)

    if(pokemon["name"]["nameFr"] != pokemon["name"]["nameEng"]){
        message.channel.send(language.getText(message.guild.id, "congratYouCatchPart1")+message.author.username+language.getText(message.guild.id, "congratYouCatchPart2")+ pokemon["name"]["nameFr"] +"/"+ pokemon["name"]["nameEng"]+":star:")
    }else{
        message.channel.send(language.getText(message.guild.id, "congratYouCatchPart1")+message.author.username+language.getText(message.guild.id, "congratYouCatchPart2")+ pokemon["name"]["nameFr"]+":star:")
    }

}


function SaveBdd(){
    fs.writeFile("./bdd/enteredCode.json", JSON.stringify(codeEntered, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}

module.exports = {enterCode}