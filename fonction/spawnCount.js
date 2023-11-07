const variableGlobal = require("../parameters/variableGlobal")
const bddCount = require("../bdd/countPokemon.json")
const fonction = require("../fonction/fonctionJs")
const minimumCount = variableGlobal.minimumCount;
const maxmumCount = variableGlobal.maximumCount;
var random = 0;
const fs = require("fs")
const catchError = require("./catchError")
const lockfile = require('lockfile');
const path = require('path');
const language = require("../fonction/language")
const eventStatChange = require("./eventStatChange")

class spawnCount{

    //Créer une avancer 
    static createCount(idServer, idChannel){
        try {
            if(bddCount[idServer] === undefined){
                bddCount[idServer] = {"nbCountMax" : maxmumCount, "nbCountActuel" : 0, "pokemonPresentActuel": {}}
            }
        
            SaveBdd();
        } catch(error) {

            catchError.saveError(idServer, idChannel, "spawnCount.js", "createCount", error)
            console.error(error)
        }
    }


    static getPokemonPresent(idServer, idChannel){
        try {
            verifPresenceCount(idServer, idChannel)
            return bddCount[idServer]["pokemonPresentActuel"][idChannel]
        } catch(error) {

            catchError.saveError(idServer, idChannel, "spawnCount.js", "getPokemonPresent", error)
            console.error(error)
        }
    }
    static getMaxRandom(idServer, idChannel){
    try {
        verifPresenceCount(idServer, idChannel)
        return bddCount[idServer]["nbCountMax"]
    } catch (error) {
        
    }
    }
    static getCount(idServer, idChannel){
        try {
            verifPresenceCount(idServer, idChannel)
            return bddCount[idServer]["nbCountActuel"]
        } catch(error) {

            catchError.saveError(idServer, idChannel, "spawnCount.js", "getMaxRandom", error)
            console.error(error)
        }
    }

    static updateHint(){
        try {
            for (const [key, value] of Object.entries(bddCount)) {
                for (const [key2, value2] of Object.entries(value["pokemonPresentActuel"])) {
    
                    if(value2 !== undefined && value2 !== null){
                        value2["hint"] = createHint(value2["hint"], value2["name"]["name"+(language.getLanguage(key))], true)
                    }
                }
            }
            SaveBdd();
        } catch(error) {
                
                catchError.saveError(null, null, "spawnCount.js", "updateHint", error)
                console.error(error)
            }

    }

    static getHint(idServer, idChannel){
        try {
            verifPresenceCount(idServer, idChannel)

            if(bddCount[idServer]["pokemonPresentActuel"][idChannel] === undefined){
                return undefined
            }
            return bddCount[idServer]["pokemonPresentActuel"][idChannel]["hint"]
        } catch(error) {
            
            catchError.saveError(idServer, idChannel, "spawnCount.js", "getHint", error)
            console.error(error)
        }
    }


    static createHint(namePokemon,realName, isAlreadyHint){
        
        try {
            if(isAlreadyHint && namePokemon === realName){
                return namePokemon
            }
            var letterReaveal = fonction.getRandomInt(namePokemon.length);

            var nameHint
            var nameChange = realName.split("");
            if(namePokemon !== realName){
                nameHint = namePokemon.split("");
            }else{
                nameHint = namePokemon.replace(/[a-zA-Z0-9]/g, "_");
                nameHint = nameHint.split("");
            }

            let arrayWithOutSlash = []
            nameHint.forEach(element => {
                if(element !== "\\"){
                    arrayWithOutSlash.push(element)
                }
            })
            
            while(arrayWithOutSlash[letterReaveal] === nameChange[letterReaveal]
            && namePokemon !== realName){
                letterReaveal = fonction.getRandomInt(nameChange.length);
            }
            
            arrayWithOutSlash[letterReaveal] = nameChange[letterReaveal];

            



            emplacementLetter = 0;
            finalHint = []
            arrayWithOutSlash.forEach(element =>{
                if(element === "_" && emplacementLetter !== 0){
                    finalHint.push("\\")
                }
                if(element === "_" && emplacementLetter === 0){
                    emplacementLetter++;
                }
                finalHint.push(element)
                
            })
            return finalHint.join("");


        } catch(error) {
                
                catchError.saveError(null, null, "spawnCount.js", "createHint", error)
                console.error(error)
            }
    }

    static setPokemonPresent(idServer, value, idChannel){
        try {
            verifPresenceCount(idServer, idChannel)
            if(value !== null){
                value["hint"] = createHint(value["name"]["name"+(language.getLanguage(idServer))],value["name"]["name"+(language.getLanguage(idServer))], false)
            }
            bddCount[idServer]["pokemonPresentActuel"][idChannel] = value;
            SaveBdd();
        } catch(error) {

            catchError.saveError(idServer, idChannel, "spawnCount.js", "setPokemonPresent", error)
            console.error(error)
        }
    }
    static setMaxRandom(idServer, idChannel){
        try {
            verifPresenceCount(idServer, idChannel)
            do{
                random = fonction.getRandomInt(eventStatChange.getGeneralStat(idServer, "messageSpawn")["max"]);
            }while(!(random>eventStatChange.getGeneralStat(idServer, "messageSpawn")["min"]))
            bddCount[idServer]["nbCountMax"] = random;
            SaveBdd();
        } catch(error) {

            catchError.saveError(idServer, idChannel, "spawnCount.js", "setMaxRandom", error)
            console.error(error)
        }
    }
    static setCount(idServer, value, idChannel){
        try {
            verifPresenceCount(idServer, idChannel)
            bddCount[idServer]["nbCountActuel"] = value;
            SaveBdd();
        } catch(error) {

            catchError.saveError(idServer, idChannel, "spawnCount.js", "setCount", error)
            console.error(error)
        }
    }

    static verifPresenceCount(idServer, idChannel){
        try {
            if(bddCount[idServer]===undefined){
                createCount(idServer, idChannel)
                
            }
        } catch(error) {

            catchError.saveError(idServer, idChannel, "spawnCount.js", "verifPresenceCount", error)
            console.error(error)
        }
    }


    static SaveBdd(){

        const lockfilePath = path.join(__dirname,"..", 'lock', 'countPokemon.lock');

        

        try{
            lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
                if (err) {
                    console.error('Erreur lors du verrouillage du fichier :', err);
                    return;
                }
            fs.writeFile(path.join(__dirname,"..", 'bdd', 'countPokemon.json'), JSON.stringify(bddCount, null, 4), (err)=> {
                if (err)console.log("erreur")

                lockfile.unlock(lockfilePath, (err) => {
                    if (err) {
                        console.error('Erreur lors du déverrouillage du fichier :', err);
                    }
                });
            });
        });
        } catch(e) {

            catchError.saveError(null, null, "spawnCount.js", "SaveBdd", e)
            console.error(e)
        }

    }
}

module.exports = spawnCount
