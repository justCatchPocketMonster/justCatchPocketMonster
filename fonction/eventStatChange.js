const variableGlobal = require("../parameters/variableGlobal");
const bddEventStat = require("../bdd/actualEventStat.json");
const saveServer = require("./pokedexSaveServer")
const fs = require("fs");
const catchError = require("./catchError")
const lockfile = require('lockfile');
const path = require('path');
const fonctionJs = require("./fonctionJs")

function defaultStat(){
    return{
        "gen" : {
            "1":variableGlobal.gen1,
            "2":variableGlobal.gen2,
            "3":variableGlobal.gen3,
            "4":variableGlobal.gen4,
            "5":variableGlobal.gen5,
            "6":variableGlobal.gen6,
            "7":variableGlobal.gen7,
            "8":variableGlobal.gen8,
            "9":variableGlobal.gen9,
        },
        "type" : {
            "acier" : variableGlobal.acier,
            "dragon" : variableGlobal.dragon,
            "electrik" : variableGlobal.electrik,
            "feu" : variableGlobal.feu,
            "insecte" : variableGlobal.insecte,
            "plante" : variableGlobal.plante,
            "psy" : variableGlobal.psy,
            "sol" : variableGlobal.sol,
            "tenebres" : variableGlobal.tenebres,
            "combat" : variableGlobal.combat,
            "eau" : variableGlobal.eau,
            "fee" : variableGlobal.fee,
            "glace" : variableGlobal.glace,
            "normal" : variableGlobal.normal,
            "poison" : variableGlobal.poison,
            "roche" : variableGlobal.roche,
            "spectre" : variableGlobal.spectre,
            "vol" : variableGlobal.vol
        },
        "rarity" : {
            "normal": variableGlobal.valeurMaxOrdinaire ,
            "legendaire": variableGlobal.valeurMaxLegendaire ,
            "fabuleux": variableGlobal.valeurMaxFabuleux 
        },
        "shiny" : variableGlobal.tauxMaxShiny,
        "timer": false,
        "whatEvent": false,
        "allowMega": false,
        "specificPokemonSpawn": undefined,
        "messageSpawn": {
            "min": variableGlobal.minimumCount,
            "max": variableGlobal.maximumCount
        
        },
        "valeurMaxChoiceEgg": variableGlobal.valeurMaxChoiceEgg,
    }
}

function maxMessageSpawn(idServer, nbMessageMax, timeInSec, event){
    try{
        if( bddEventStat[idServer] == undefined){
            createResetEventStat(idServer)
        }

        bddEventStat[idServer]["messageSpawn"]["max"] = nbMessageMax

        bddEventStat[idServer]["timer"] = timeInSec;
        bddEventStat[idServer]["whatEvent"] = event;

        SaveBdd()
    } catch(e) {

        catchError.saveError(idServer, null, "eventStatChange.js", "specificPokemonSpawn", e)
        console.error(e)
    }
}


function minMessageSpawn(idServer, nbMessageMin, timeInSec, event){
    try{
        if( bddEventStat[idServer] == undefined){
            createResetEventStat(idServer)
        }

        bddEventStat[idServer]["messageSpawn"]["min"] = nbMessageMin

        bddEventStat[idServer]["timer"] = timeInSec;
        bddEventStat[idServer]["whatEvent"] = event;

        SaveBdd()
    } catch(e) {

        catchError.saveError(idServer, null, "eventStatChange.js", "specificPokemonSpawn", e)
        console.error(e)
    }
}



function specificPokemonSpawn(idServer, pokemonId, timeInSec, event){
    try{
        if( bddEventStat[idServer] == undefined){
            createResetEventStat(idServer)
        }

        bddEventStat[idServer]["specificPokemonSpawn"] = pokemonId

        bddEventStat[idServer]["timer"] = timeInSec;
        bddEventStat[idServer]["whatEvent"] = event;

        SaveBdd()
    } catch(e) {

        catchError.saveError(idServer, null, "eventStatChange.js", "specificPokemonSpawn", e)
        console.error(e)
    }
}



function megaAllow(idServer, timeInSec, event){
    try{
        if( bddEventStat[idServer] == undefined){
            createResetEventStat(idServer)
        }

        bddEventStat[idServer]["allowMega"] = true

        bddEventStat[idServer]["timer"] = timeInSec;
        bddEventStat[idServer]["whatEvent"] = event;

        SaveBdd()
    } catch(e) {

        catchError.saveError(idServer, null, "eventStatChange.js", "megaAllow", e)
        console.error(e)
    }
}

function changeRarity(idServer,theRarityChoice, valueLessAll, timeInSec, event){
    try{
    
        if( bddEventStat[idServer] == undefined){
            createResetEventStat(idServer)
        }

        bddEventStat[idServer]["rarity"]["normal"] -= valueLessAll
        if(theRarityChoice == "normal"){
            bddEventStat[idServer]["rarity"]["normal"] += 2*valueLessAll
        } else {
            bddEventStat[idServer]["rarity"][theRarityChoice] += valueLessAll
        }

        bddEventStat[idServer]["timer"] = timeInSec;
        bddEventStat[idServer]["whatEvent"] = event;

        SaveBdd()
    } catch(e) {

        catchError.saveError(idServer, null, "eventStatChange.js", "changeRarity", e)
        console.error(e)
    }
    
}

function changeType(idServer,theTypeChoice, valueLessAll, timeInSec, event){
    try{
        
        if( bddEventStat[idServer] == undefined){
            createResetEventStat(idServer)
        }

        for (const [key, value] of Object.entries(getGeneralStat(idServer, "type"))) {
            
            bddEventStat[idServer]["type"][key] -= valueLessAll

        }
        bddEventStat[idServer]["type"][theTypeChoice] += valueLessAll*(variableGlobal.nbType-1)


        bddEventStat[idServer]["timer"] = timeInSec;
        bddEventStat[idServer]["whatEvent"] = event;

        SaveBdd()
    } catch(e) {

        catchError.saveError(idServer, null, "eventStatChange.js", "changeType", e)
        console.error(e)
    }
}

function changeGen(idServer,theGenChoice, valueLessAll, timeInSec, event){
    try{
        
        if( bddEventStat[idServer] == undefined){
            createResetEventStat(idServer)
        }

        for (const [key, value] of Object.entries(getGeneralStat(idServer, "gen"))) {
            
            bddEventStat[idServer]["gen"][key] -= valueLessAll

        }
        bddEventStat[idServer]["gen"][theGenChoice] += valueLessAll*(variableGlobal.nbGeneration)+valueLessAll


        bddEventStat[idServer]["timer"] = timeInSec;
        bddEventStat[idServer]["whatEvent"] = event;

        SaveBdd()
    } catch(e) {

        catchError.saveError(idServer, null, "eventStatChange.js", "changeGen", e)
        console.error(e)
    }
    
}

function changeShiny(idServer, valueToDivise, timeInSec, event){
    try{
        if( bddEventStat[idServer] == undefined){
            createResetEventStat(idServer)
        }

        bddEventStat[idServer]["shiny"] /= valueToDivise

        bddEventStat[idServer]["timer"] = timeInSec;
        bddEventStat[idServer]["whatEvent"] = event;
        SaveBdd()
    } catch(e) {

        catchError.saveError(idServer, null, "eventStatChange.js", "changeShiny", e)
        console.error(e)
    }
}

function createResetEventStat(idServer){
    try{
        bddEventStat[idServer] = defaultStat();
        SaveBdd();
    } catch(e) {

        catchError.saveError(idServer, null, "eventStatChange.js", "createResetEventStat", e)
        console.error(e)
    }
}



function getGeneralStat(idServer, generalStat){
    try{
        if( bddEventStat[idServer] == undefined){
            createResetEventStat(idServer)
        }

        return bddEventStat[idServer][generalStat]
    } catch(e) {

        catchError.saveError(idServer, null, "eventStatChange.js", "getGeneralStat", e)
        console.error(e)
    }
}

function getStat(idServer, generalStat, specificStat){
    try{
        if( bddEventStat[idServer] == undefined){
            createResetEventStat(idServer)
        }

        return bddEventStat[idServer][generalStat][specificStat]
    } catch(e) {

        catchError.saveError(idServer, null, "eventStatChange.js", "getStat", e)
        console.error(e)
    }
}

function resetAtZero(key){
    statDefaultModificable = defaultStat();

    if(saveServer.getCharmChroma(key)["charmeChroma"]){
        statDefaultModificable["shiny"] = variableGlobal.tauxMaxShiny/2;
    }

    bddEventStat[key] = statDefaultModificable;
    SaveBdd();
}


async function time(){
    try{
        for (const [key, value] of Object.entries(bddEventStat)) {

            dateEnd = new Date(bddEventStat[key]["timer"])
            actualDate = new Date();

            dateDiff = fonctionJs.dateDiff(actualDate, dateEnd)
            
            if(dateDiff.sec < 0 || dateDiff.min < 0 || dateDiff.hour < 0 || dateDiff.day < 0 || dateDiff.month < 0 || dateDiff.year < 0){
                
                resetAtZero(key);
            }

            
        }

        
    } catch(e) {

        catchError.saveError(null, null, "eventStatChange.js", "time", e)
        console.error(e)
    }

}



function SaveBdd(){

    const lockfilePath = path.join(__dirname,"..", 'lock', 'actualEventStat.lock');

    try{
        lockfile.lock(lockfilePath, {"retries": 1000, "retryWait": 1000}, (err) => {
            if (err) {
                console.error('Erreur lors du verrouillage du fichier :', err);
                return;
            }
        fs.writeFile(path.join(__dirname,"..", 'bdd', 'actualEventStat.json'), JSON.stringify(bddEventStat, null, 4), (err)=> {
            if (err)console.log("erreur: ", err)

            lockfile.unlock(lockfilePath, (err) => {
                if (err) {
                    console.error('Erreur lors du déverrouillage du fichier :', err);
                }
            });
        });
    });
    } catch(e) {

        catchError.saveError(null, null, "eventStatChange.js", "SaveBdd", e)
        console.error(e)
    }
}

module.exports = {maxMessageSpawn, minMessageSpawn, specificPokemonSpawn, megaAllow, time, getStat, changeRarity, changeGen, changeType, changeShiny, getGeneralStat, getStat}