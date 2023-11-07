const languageBdd = require("../bdd/languageSelected.json")
const languageTextBdd = require("../bdd/languageText.json")
const fs = require("fs");
const catchError = require("./catchError")
const lockfile = require('lockfile');
const path = require('path');

class language{

    static getText(idServer, nameText){
        try {
            if(languageBdd[idServer] === undefined ){
                setLanguage(idServer, "Eng", null)
            }
        
        
            return languageTextBdd[nameText][getLanguage(idServer)][0]
        
        } catch(error) {

            catchError.saveError(null, null, "language.js", "getText", error)
            console.error(error)
        }
    }

    static setLanguage(idServer, language, interaction){

        try {
            language = language.toLowerCase();
        
            if(language === "fr"){
                languageBdd[idServer] = "Fr" 
                if(interaction!= null){
                    interaction.channel.send("Vous avez choisie la langue Fr")
                }
                SaveBdd();
            }else if(language === "eng"){
                languageBdd[idServer] = "Eng"
                if(interaction!= null){
                    interaction.channel.send("You have chosen the language Eng")
                }
                SaveBdd();
            } else{
                if(interaction!= null){
                    interaction.channel.send(getText(interaction.guild.id, "errorLanguageChoose"))
                }
            }
        } catch(error) {

            catchError.saveError(null, null, "language.js", "setLanguage", error)
            console.error(error)
        }
        
    }

    static getLanguage(idServer){
        try {
            return languageBdd[idServer]
        } catch(error) {

            catchError.saveError(null, null, "language.js", "getLanguage", error)
            console.error(error)
        }
    }
    static SaveBdd(){

        const lockfilePath = path.join(__dirname,"..", 'lock', 'languageSelected.lock');

        try{
            lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
                if (err) {
                    console.error('Erreur lors du verrouillage du fichier :', err);
                    return;
                }
            fs.writeFile(path.join(__dirname,"..", 'bdd', 'languageSelected.json'), JSON.stringify(languageBdd, null, 4), (err)=> {
                if (err)console.log("erreur")

                lockfile.unlock(lockfilePath, (err) => {
                    if (err) {
                        console.error('Erreur lors du déverrouillage du fichier :', err);
                    }
                });
            });
        });
        } catch(e) {

            catchError.saveError(null, null, "language.js", "SaveBdd", e)
            console.error(e)
        }

    }
}
module.exports = language