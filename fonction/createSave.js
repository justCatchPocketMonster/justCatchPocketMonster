const fs = require("fs");
const fonction = require("../fonction/fonctionJs")
const catchError = require("./catchError")

const allFileJson = ["catchError.json","countPokemon.json","languageSelected.json","pokedexSaveUser.json","pokedexSaveServer.json","serversAllowThisChannel.json","stat.json", "shinydexSaveUser.json", "enteredCode.json", "charmeChroma.json", "catchError.json"]

function createCopyAllBdd(){

    try{

        var emplacement = fonction.actualDate();
        if(!fs.existsSync("./save/"+emplacement)){
            fs.mkdir("./save/"+emplacement, (err) =>{
                if(err){
                    console.log(err)
                } else {
                    allFileJson.forEach(key => {
        
                        fs.copyFile("./bdd/"+key, "./save/"+emplacement+"/"+key, (err) =>{
                            if(err){
                                console.log(err)
                            } else {
            
                            }
                        })
                    })
                }
            })
        }
    } catch(e) {

        catchError.saveError(null, null, "createSave.js", "createCopyAllBdd", e)
        console.error(e)
    }
}




module.exports = {createCopyAllBdd}



