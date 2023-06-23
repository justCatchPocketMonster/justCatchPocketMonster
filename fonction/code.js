const codeEntered = require("../bdd/enteredCode.json")
const language = require("../fonction/language")
const pokemonObject = require("../object/PokemonObject")
const savePokemonUser = require("./pokedexSaveUser")
const saveShinyUser = require("./shinydexSaveUser")
const codeBdd = require("../bdd/code.json")
const fs = require("fs");
const catchError = require("./catchError")
const lockfile = require('lockfile');
const path = require('path');

async function enterCode(idUser, code, interaction){

    try{

        if(codeEntered[idUser] === undefined){
            createUser(idUser)
            SaveBdd();
        }
        codeHasEffect(idUser, code, interaction)
    } catch(e) {

        catchError.saveError(interaction.guild.id, interaction.channel.id, "code.js", "enterCode", e)
        console.error(e)
    }
}

function createUser(idUser){
    try{
        codeEntered[idUser] = []
        return
    } catch(e) {

        catchError.saveError(null, null, "code.js", "createUser", e)
        console.error(e)
    }
}

async function codeHasEffect (idUser, code, interaction){
    try{

        if(codeBdd["shiny"].includes(code)){
            if(codeEntered[idUser].includes(code)){
                interaction.channel.send(language.getText(interaction.guild.id, "codeAlreadyUsed"));
                
            } else {
                effectCode1(idUser, interaction);
                codeEntered[idUser].push(code);
            }
            SaveBdd();
            return
        }


        interaction.channel.send(language.getText(interaction.guild.id, "codeDontExist"));
    } catch(e) {

        catchError.saveError(interaction.guild.id, interaction.channel.id, "code.js", "codeHasEffect", e)
        console.error(e)
    }
}

/**
 * sert a donné un pokemon shiny
 */
function effectCode1(idUser, interaction){
    try{
        pokemon = pokemonObject.pokemonSelect();

        savePokemonUser.pokedex(pokemon["id"], idUser)
        saveShinyUser.pokedex(pokemon["id"], idUser)

        if(pokemon["name"]["nameFr"] != pokemon["name"]["nameEng"]){
            interaction.channel.send(language.getText(interaction.guild.id, "congratYouCatchPart1")+interaction.user.username+language.getText(interaction.guild.id, "congratYouCatchPart2")+ pokemon["name"]["nameFr"] +"/"+ pokemon["name"]["nameEng"]+":star:")
        }else{
            interaction.channel.send(language.getText(interaction.guild.id, "congratYouCatchPart1")+interaction.user.username+language.getText(interaction.guild.id, "congratYouCatchPart2")+ pokemon["name"]["nameFr"]+":star:")
        }

    } catch(e) {

        catchError.saveError(interaction.guild.id, interaction.channel.id, "code.js", "effectCode1", e)
        console.error(e)
    }
}

function SaveBdd(){

    const lockfilePath = path.join(__dirname,"..", 'lock', 'enteredCode.lock');

    

    try{
        lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
            if (err) {
                console.error('Erreur lors du verrouillage du fichier :', err);
                return;
            }
        fs.writeFile(path.join(__dirname,"..", 'bdd', 'enteredCode.json'), JSON.stringify(codeEntered, null, 4), (err)=> {
            if (err)console.log("erreur")

            lockfile.unlock(lockfilePath, (err) => {
                if (err) {
                    console.error('Erreur lors du déverrouillage du fichier :', err);
                }
            });
        });
    });
    } catch(e) {

        catchError.saveError(null, null, "code.js", "SaveBdd", e)
        console.error(e)
    }


}

module.exports = {enterCode}