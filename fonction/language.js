const languageBdd = require("../bdd/languageSelected.json")
const languageTextBdd = require("../bdd/languageText.json")
const fs = require("fs");

function getText(idServer, nameText){
    if(languageBdd[idServer] === undefined ){
        setLanguage(idServer, "Eng", null)
    }
   
   
    return languageTextBdd[nameText][getLanguage(idServer)][0]

}

function setLanguage(idServer, language, interaction){

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
    
}

function getLanguage(idServer){
    return languageBdd[idServer]
}

function SaveBdd(){
    fs.writeFile("./bdd/languageSelected.json", JSON.stringify(languageBdd, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}

module.exports = {getText, setLanguage, getLanguage}