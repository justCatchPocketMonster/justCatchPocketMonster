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
const stat = require("../fonction/stat.js")

const paliers = [5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 2500000, 3000000];


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

/**
 * 
 * @param {int} palier 
 * @param {string} type 
 */
function modifierDonneesSpawn(palier, type) {
    try{
        // Suppression des codes existants liés au spawn
        var codesASupprimer = codeBdd.shiny.filter(code => code.includes(type));
        codeBdd.shiny = codeBdd.shiny.filter(code => !codesASupprimer.includes(code));
    

        var nouveauCode = palier + type;
        codeBdd.shiny.push(nouveauCode);
        const lockfilePath = path.join(__dirname,"..", 'lock', 'code.lock');
    
        lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
            if (err) {
                console.error('Erreur lors du verrouillage du fichier :', err);
                return;
            }
        fs.writeFile(path.join(__dirname,"..", 'bdd', 'code.json'), JSON.stringify(codeBdd, null, 4), (err)=> {
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

async function codeIsOutdated() {

    statCatch = stat.getCountAllCatch();
    statSpawn = stat.getCountAllSpawn();

    //if(statSpawn == undefined || statCatch == undefined) return;

    actualCodeValueSpawn = codeBdd.shiny.filter(code => code.includes("SPAWNS"))[0].split("SPAWNS")[0];
    actualCodeValueCatch = codeBdd.shiny.filter(code => code.includes("CATCHS"))[0].split("CATCHS")[0];

    
    paliers.forEach(palier => {
        if (statSpawn >= palier && actualCodeValueSpawn < palier) {
            modifierDonneesSpawn(palier, "SPAWNS");
        }
        if (statCatch >= palier && actualCodeValueCatch < palier) {
            modifierDonneesSpawn(palier, "CATCHS");
        }
    });

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

module.exports = {enterCode, codeIsOutdated}