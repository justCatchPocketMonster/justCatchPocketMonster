const variableGlobal = require("../parameters/variableGlobal");
const bddEventStat = require("../bdd/actualEventStat.json");
const saveServer = require("./pokedexSaveServer")
const fs = require("fs");



const defaultStat = {
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
    "whatEvent": false
}

function changeRarity(idServer,theRarityChoice, valueLessAll, timeInSec, event){
    
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
    
}

function changeType(idServer,theTypeChoice, valueLessAll, timeInSec, event){
    
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
}

function changeGen(idServer,theGenChoice, valueLessAll, timeInSec, event){
    
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
    
}

function changeShiny(idServer, valueToDivise, timeInSec, event){
    if( bddEventStat[idServer] == undefined){
        createResetEventStat(idServer)
    }

    bddEventStat[idServer]["shiny"] /= valueToDivise

    bddEventStat[idServer]["timer"] = timeInSec;
    bddEventStat[idServer]["whatEvent"] = event;
    SaveBdd()

}

function createResetEventStat(idServer){
    bddEventStat[idServer] = defaultStat;
    SaveBdd();
}



function getGeneralStat(idServer, generalStat){
    if( bddEventStat[idServer] == undefined){
        createResetEventStat(idServer)
    }

    return bddEventStat[idServer][generalStat]
}

function getStat(idServer, generalStat, specificStat){
    if( bddEventStat[idServer] == undefined){
        createResetEventStat(idServer)
    }

    return bddEventStat[idServer][generalStat][specificStat]
}


function time(){
    
    for (const [key, value] of Object.entries(bddEventStat)) {
        if(bddEventStat[key]["timer"] != false){
            bddEventStat[key]["timer"]--;

            if(bddEventStat[key]["timer"] <= 0){
                statDefaultModificable = defaultStat;
                if(saveServer.getCharmChroma(key)["charmeChroma"]){
                    statDefaultModificable["shiny"] = variableGlobal.tauxMaxShiny/2;
                }

                bddEventStat[key] = statDefaultModificable;
            }
        }
    }

      SaveBdd()  

}




function SaveBdd(){
    fs.writeFile("./bdd/actualEventStat.json", JSON.stringify(bddEventStat, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}

module.exports = {time, getStat, changeRarity, changeGen, changeType, changeShiny, getGeneralStat, getStat}