const statBdd = require("../bdd/stat.json")
const pokeData = require("../bdd/pokemon.json");
const variableGlobal = require("../parameters/variableGlobal")
const nbPokemon = (pokeData.length);
const language = require("./language")
var version = variableGlobal.version;
const fs = require("fs")
const Discord = require("discord.js")
const catchError = require("./catchError")


/**
 * Ajout +1 a l'index du pokemon dans la sauvegarde et créer la sauvegarde si elle n'existe pas et la met a jour si elle ne l'est pas
 * @param {int} idPokemon //id pour l'index
 */
 function statAddSpawn(idPokemon, isShiny){
try {
    
        createStatVersion()
    
        if(statBdd[version]["listPokemonSpawned"][nbPokemon] === undefined){
            updateNumberPossibilitySpawned();
        }
    
        statBdd[version]["pokemonSpawned"]+=1;
        statBdd["All"]["pokemonSpawned"]+=1;
        statBdd[version]["listPokemonSpawned"][idPokemon]+=1;
        statBdd["All"]["listPokemonSpawned"][idPokemon]+=1;
        if(isShiny){
            statBdd[version]["pokemonSpawnedShiny"]+=1;
            statBdd["All"]["pokemonSpawnedShiny"]+=1;
            statBdd[version]["listPokemonSpawnedShiny"][idPokemon]+=1;
            statBdd["All"]["listPokemonSpawnedShiny"][idPokemon]+=1;
        }
        SaveBdd();
} catch(error) {

        catchError.saveError(null, null, "stat.js", "statAddSpawn", error)
        console.error(error)
    }
}

/**
 * Ajout +1 a l'index du pokemon dans la sauvegarde et créer la sauvegarde si elle n'existe pas et la met a jour si elle ne l'est pas
 * @param {int} idPokemon //id pour l'index
 */
 function statAddCatch(idPokemon, isShiny){
try {
    
        createStatVersion()
    
    
        if(statBdd[version]["listPokemonCatched"][nbPokemon] === undefined){
            updateNumberPossibilityCatched();
        }
        statBdd[version]["pokemonCatched"]+=1;
        statBdd["All"]["pokemonCatched"]+=1;
        statBdd[version]["listPokemonCatched"][idPokemon]+=1;
        statBdd["All"]["listPokemonCatched"][idPokemon]+=1;
        if(isShiny){
            statBdd[version]["pokemonCatchedShiny"]+=1;
            statBdd["All"]["pokemonCatchedShiny"]+=1;
            statBdd[version]["listPokemonCatchedShiny"][idPokemon]+=1;
            statBdd["All"]["listPokemonCatchedShiny"][idPokemon]+=1;
        }
        SaveBdd();
} catch(error) {

        catchError.saveError(null, null, "stat.js", "statAddCatch", error)
        console.error(error)
    }
}

function stringObjectPokemonMostAndLeastCatch(interaction){
try {
        let listPokemonCatched = getCountAllCatchList();
    
        let leastPokemonCatch = {
            "nbCapture": 9999999,
            "listPokemon": []
        }
        let mostPokemonCatch = {
            "nbCapture": 0,
            "listPokemon": []
        }
    
        
        for (const [key, value] of Object.entries(listPokemonCatched)) {
    
            if(leastPokemonCatch.nbCapture == value){
                leastPokemonCatch.listPokemon.push(key)
            }
            if(leastPokemonCatch.nbCapture > value){
                leastPokemonCatch.nbCapture = value
                leastPokemonCatch.listPokemon = []
    
                leastPokemonCatch.listPokemon.push(key)
            }
            
            if(mostPokemonCatch.nbCapture == value){
                mostPokemonCatch.listPokemon.push(key)
            }
    
    
            if(mostPokemonCatch.nbCapture < value){
                mostPokemonCatch.nbCapture = value
                mostPokemonCatch.listPokemon = []
    
                mostPokemonCatch.listPokemon.push(key)
            }
            
    
        }
    
    
    
        let chosenMostPokemonCatch = "";
        let chosenLeastPokemonCatch = "";
    
        if(leastPokemonCatch.listPokemon.length > 3){
            chosenLeastPokemonCatch = language.getText(interaction.guild.id, "tooMuchPokemon") +" : " + leastPokemonCatch.nbCapture;
        } else {
            leastPokemonCatch.listPokemon.forEach( idPokemon => {
                chosenLeastPokemonCatch += pokeData[idPokemon].name["name"+ language.getLanguage(interaction.guild.id)]+" "
    
                
            })
            chosenLeastPokemonCatch += ": "+ leastPokemonCatch.nbCapture
        }
        if(mostPokemonCatch.listPokemon.length > 3){
            chosenMostPokemonCatch = language.getText(interaction.guild.id, "tooMuchPokemon")+" : " + mostPokemonCatch.nbCapture;
    
        } else {
            mostPokemonCatch.listPokemon.forEach( idPokemon => {
                chosenMostPokemonCatch += pokeData[idPokemon].name["name"+ language.getLanguage(interaction.guild.id)]+" "
            
                
            })
    
            chosenMostPokemonCatch += ": "+ mostPokemonCatch.nbCapture
        }
    
        return {
            "most": chosenMostPokemonCatch,
            "least": chosenLeastPokemonCatch
        }
    
} catch(error) {

        catchError.saveError(null, null, "stat.js", "stringObjectPokemonMostAndLeastCatch", error)
        console.error(error)
    }
    
}

function stringObjectPokemonMostAndLeastSpawn(interaction){
try {
        let listPokemonSpawned = getCountAllSpawnList();
    
        let leastPokemonSpawn = {
            "nbCapture": 9999999,
            "listPokemon": []
        }
        let mostPokemonSpawn = {
            "nbCapture": 0,
            "listPokemon": []
        }
    
        
        for (const [key, value] of Object.entries(listPokemonSpawned)) {
    
            if(leastPokemonSpawn.nbCapture == value){
                leastPokemonSpawn.listPokemon.push(key)
            }
            if(leastPokemonSpawn.nbCapture > value){
                leastPokemonSpawn.nbCapture = value
                leastPokemonSpawn.listPokemon = []
    
                leastPokemonSpawn.listPokemon.push(key)
            }
            
            if(mostPokemonSpawn.nbCapture == value){
                mostPokemonSpawn.listPokemon.push(key)
            }
    
    
            if(mostPokemonSpawn.nbCapture < value){
                mostPokemonSpawn.nbCapture = value
                mostPokemonSpawn.listPokemon = []
    
                mostPokemonSpawn.listPokemon.push(key)
            }
            
    
        }
    
    
    
        let chosenMostPokemonSpawn = "";
        let chosenLeastPokemonSpawn = "";
    
        if(leastPokemonSpawn.listPokemon.length > 3){
            chosenLeastPokemonSpawn = language.getText(interaction.guild.id, "tooMuchPokemon") +" : " + leastPokemonSpawn.nbCapture;
        } else {
            leastPokemonSpawn.listPokemon.forEach( idPokemon => {
                chosenLeastPokemonSpawn += pokeData[idPokemon].name["name"+ language.getLanguage(interaction.guild.id)]+" "
    
                
            })
            chosenLeastPokemonSpawn += ": "+ leastPokemonSpawn.nbCapture
        }
        if(mostPokemonSpawn.listPokemon.length > 3){
            chosenMostPokemonSpawn = language.getText(interaction.guild.id, "tooMuchPokemon")+" : " + mostPokemonSpawn.nbCapture;
    
        } else {
            mostPokemonSpawn.listPokemon.forEach( idPokemon => {
                chosenMostPokemonSpawn += pokeData[idPokemon].name["name"+ language.getLanguage(interaction.guild.id)]+" "
            
                
            })
    
            chosenMostPokemonSpawn += ": "+ mostPokemonSpawn.nbCapture
        }
    
        return {
            "most": chosenMostPokemonSpawn,
            "least": chosenLeastPokemonSpawn
        }
    
        
} catch(error) {

        catchError.saveError(null, null, "stat.js", "stringObjectPokemonMostAndLeastSpawn", error)
        console.error(error)
    }
}



function embedStat(interaction){
try {
        
        mostLeastCatch = stringObjectPokemonMostAndLeastCatch(interaction);
        mostLeastSpawn = stringObjectPokemonMostAndLeastSpawn(interaction);
    
    
    
        let statEmbed = new Discord.EmbedBuilder()
            .setTitle("stats")
            .setColor("Purple")
            .addFields(
                {name: language.getText(interaction.guild.id, "nombreDeCaptureTotaly"), value: getCountAllCatch()+"", inline:true},
                {name: language.getText(interaction.guild.id, "nombreDeCaptureShinyTotaly"), value: getCountAllCatchShiny()+"", inline:true}
                )
            .addFields(
                {name: language.getText(interaction.guild.id, "nombreDeSpawnTotaly"), value: getCountAllSpawn()+"", inline:true},
                {name: language.getText(interaction.guild.id, "nombreDeSpawnShinyTotaly"), value: getCountAllSpawnShiny()+"", inline:true}
                )
            .addFields(
                {name: language.getText(interaction.guild.id, "nombreDeCaptureVersion"), value: getCountVersionCatch()+"", inline:true},
                {name: language.getText(interaction.guild.id, "nombreDeCaptureShinyVersion"), value: getCountVersionCatchShiny()+"", inline:true}
                )
            .addFields(
                {name: language.getText(interaction.guild.id, "nombreDeSpawnVersion"), value: getCountVersionSpawn()+"", inline:true},
                {name: language.getText(interaction.guild.id, "nombreDeSpawnShinyVersion"), value: getCountVersionSpawnShiny()+"", inline:true}
                )
            .addFields(
                {name: language.getText(interaction.guild.id, "pokemonLeastCaught"), value: mostLeastCatch["least"], inline:true},
                {name: language.getText(interaction.guild.id, "pokemonMostCaught"), value: mostLeastCatch["most"], inline:true}
                )
            .addFields(
                {name: language.getText(interaction.guild.id, "pokemonLeastSpawn"), value: mostLeastSpawn["least"], inline:true},
                {name: language.getText(interaction.guild.id, "pokemonMostSpawn"), value: mostLeastSpawn["most"], inline:true}
                )
    
    
            interaction.channel.send({embeds: [statEmbed]});
} catch(error) {

        catchError.saveError(null, null, "stat.js", "embedStat", error)
        console.error(error)
    }
}


function createStatVersion(){
try {
    
        if(statBdd["All"] === undefined){
            statBdd["All"]= {};
        }
        if(statBdd["All"]["pokemonSpawned"] === undefined){
            statBdd["All"]["pokemonSpawned"] = 0;
        }
        if(statBdd["All"]["pokemonCatched"] === undefined){
            statBdd["All"]["pokemonCatched"] = 0;
        }
        if(statBdd["All"]["pokemonSpawnedShiny"] === undefined){
            statBdd["All"]["pokemonSpawnedShiny"] = 0;
        }
        if(statBdd["All"]["pokemonCatchedShiny"] === undefined){
            statBdd["All"]["pokemonCatchedShiny"] = 0;
        }
        if(statBdd["All"]["listPokemonSpawned"] === undefined){
            statBdd["All"]["listPokemonSpawned"] = {};
        }
        if(statBdd["All"]["listPokemonCatched"] === undefined){
            statBdd["All"]["listPokemonCatched"] = {};
        }
        if(statBdd["All"]["listPokemonSpawnedShiny"] === undefined){
            statBdd["All"]["listPokemonSpawnedShiny"] = {};
        }
        if(statBdd["All"]["listPokemonCatchedShiny"] === undefined){
            statBdd["All"]["listPokemonCatchedShiny"] = {};
        }
        if(statBdd[version] === undefined){
            statBdd[version]= {};
        }
        if(statBdd[version]["pokemonSpawned"] === undefined){
            statBdd[version]["pokemonSpawned"] = 0;
        }
        if(statBdd[version]["pokemonCatched"] === undefined){
            statBdd[version]["pokemonCatched"] = 0;
        }
        if(statBdd[version]["pokemonSpawnedShiny"] === undefined){
            statBdd[version]["pokemonSpawnedShiny"] = 0;
        }
        if(statBdd[version]["pokemonCatchedShiny"] === undefined){
            statBdd[version]["pokemonCatchedShiny"] = 0;
        }
        if(statBdd[version]["listPokemonSpawned"] === undefined){
            statBdd[version]["listPokemonSpawned"] = {};
        }
        if(statBdd[version]["listPokemonCatched"] === undefined){
            statBdd[version]["listPokemonCatched"] = {};
        }
        if(statBdd[version]["listPokemonSpawnedShiny"] === undefined){
            statBdd[version]["listPokemonSpawnedShiny"] = {};
        }
        if(statBdd[version]["listPokemonCatchedShiny"] === undefined){
            statBdd[version]["listPokemonCatchedShiny"] = {};
        }
    
    
    
    
        SaveBdd();
} catch(error) {

        catchError.saveError(null, null, "stat.js", "createStatVersion", error)
        console.error(error)
    }
}


function updateNumberPossibilitySpawned(){
try {
        for(let i = 1; i < nbPokemon; i++){
            if(statBdd["All"]["listPokemonSpawned"][i]=== undefined){
                statBdd["All"]["listPokemonSpawned"][i] = 0;
            } else {
                statBdd["All"]["listPokemonSpawned"][i] = statBdd["All"]["listPokemonSpawned"][i];
            }
            if(statBdd["All"]["listPokemonSpawnedShiny"][i]=== undefined){
                statBdd["All"]["listPokemonSpawnedShiny"][i] = 0;
            } else {
                statBdd["All"]["listPokemonSpawnedShiny"][i] = statBdd["All"]["listPokemonSpawnedShiny"][i];
            }
            if(statBdd[version]["listPokemonSpawned"][i]=== undefined){
                statBdd[version]["listPokemonSpawned"][i] = 0;
            } else {
                statBdd[version]["listPokemonSpawned"][i] = statBdd[version]["listPokemonSpawned"][i];
            }
            
            if(statBdd[version]["listPokemonSpawnedShiny"][i]=== undefined){
                statBdd[version]["listPokemonSpawnedShiny"][i] = 0;
            } else {
                statBdd[version]["listPokemonSpawnedShiny"][i] = statBdd[version]["listPokemonSpawnedShiny"][i];
            }
            
        }
        SaveBdd();
        
} catch(error) {

        catchError.saveError(null, null, "stat.js", "updateNumberPossibilitySpawned", error)
        console.error(error)
    }
}

function updateNumberPossibilityCatched(){
try {
        for(let i = 1; i < nbPokemon; i++){
            if(statBdd["All"]["listPokemonCatched"][i]=== undefined){
                statBdd["All"]["listPokemonCatched"][i] = 0;
            }else {
                statBdd["All"]["listPokemonCatched"][i] = statBdd["All"]["listPokemonCatched"][i];
            }
            if(statBdd["All"]["listPokemonCatchedShiny"][i]=== undefined){
                statBdd["All"]["listPokemonCatchedShiny"][i] = 0;
            }else {
                statBdd["All"]["listPokemonCatchedShiny"][i] = statBdd["All"]["listPokemonCatchedShiny"][i];
            }
            if(statBdd[version]["listPokemonCatched"][i]=== undefined){
                statBdd[version]["listPokemonCatched"][i] = 0;
            }else {
                statBdd[version]["listPokemonCatched"][i] = statBdd[version]["listPokemonCatched"][i];
            }
            
            if(statBdd[version]["listPokemonCatchedShiny"][i]=== undefined){
                statBdd[version]["listPokemonCatchedShiny"][i] = 0;
            }else {
                statBdd[version]["listPokemonCatchedShiny"][i] = statBdd[version]["listPokemonCatchedShiny"][i];
            }
            
        }
        SaveBdd();
} catch(error) {

        catchError.saveError(null, null, "stat.js", "updateNumberPossibilityCatched", error)
        console.error(error)
    }
    
}

function getCountAllCatch(){
try {
        return statBdd["All"]["pokemonCatched"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountAllCatch", error)
        console.error(error)
    }
}
function getCountAllSpawn(){
try {
        return statBdd["All"]["pokemonSpawned"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountAllSpawn", error)
        console.error(error)
    }
}
function getCountAllCatchShiny(){
try {
        return statBdd["All"]["pokemonCatchedShiny"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountAllCatchShiny", error)
        console.error(error)
    }
}
function getCountAllSpawnShiny(){
try {
        return statBdd["All"]["pokemonSpawnedShiny"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountAllSpawnShiny", error)
        console.error(error)
    }
}
function getCountAllCatchList(){
try {
        return statBdd["All"]["listPokemonCatched"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountAllCatchList", error)
        console.error(error)
    }
}
function getCountAllSpawnList(){
try {
        return statBdd["All"]["listPokemonSpawned"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountAllSpawnList", error)
        console.error(error)
    }
}
function getCountAllCatchShinyList(){
try {
        return statBdd["All"]["listPokemonCatchedShiny"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountAllCatchShinyList", error)
        console.error(error)
    }
}
function getCountAllSpawnShinyList(){
try {
        return statBdd["All"]["listPokemonSpawnedShiny"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountAllSpawnShinyList", error)
        console.error(error)
    }
}

function getCountVersionCatch(){
try {
        createStatVersion();
        return statBdd[version]["pokemonCatched"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountVersionCatch", error)
        console.error(error)
    }
}
function getCountVersionSpawn(){
try {
        createStatVersion();
        return statBdd[version]["pokemonSpawned"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountVersionSpawn", error)
        console.error(error)
    }
}
function getCountVersionCatchShiny(){
try {
        createStatVersion();
        return statBdd[version]["pokemonCatchedShiny"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountVersionCatchShiny", error)
        console.error(error)
    }
}
function getCountVersionSpawnShiny(){
try {
        createStatVersion();
        return statBdd[version]["pokemonSpawnedShiny"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountVersionSpawnShiny", error)
        console.error(error)
    }
}
function getCountVersionCatchList(){
try {
        createStatVersion();
        updateNumberPossibilitySpawned();
        updateNumberPossibilityCatched();
        return statBdd[version]["listPokemonCatched"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountVersionCatchList", error)
        console.error(error)
    }
}
function getCountVersionSpawnList(){
try {
        createStatVersion();
        updateNumberPossibilitySpawned();
        updateNumberPossibilityCatched();
        return statBdd[version]["listPokemonSpawned"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountVersionSpawnList", error)
        console.error(error)
    }
}
function getCountVersionCatchShinyList(){
try {
        createStatVersion();
        updateNumberPossibilitySpawned();
        updateNumberPossibilityCatched();
        return statBdd[version]["listPokemonCatchedShiny"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountVersionCatchShinyList", error)
        console.error(error)
    }
}
function getCountVersionSpawnShinyList(){
try {
        createStatVersion();
        updateNumberPossibilitySpawned();
        updateNumberPossibilityCatched();
        return statBdd[version]["listPokemonSpawnedShiny"]
} catch(error) {

        catchError.saveError(null, null, "stat.js", "getCountVersionSpawnShinyList", error)
        console.error(error)
    }
}


function SaveBdd(){
try {
        fs.writeFile("./bdd/stat.json", JSON.stringify(statBdd, null, 4), (err)=> {
            if (err)console.log("erreur")
        })
} catch(error) {

        catchError.saveError(null, null, "stat.js", "SaveBdd", error)
        console.error(error)
    }
}

module.exports = {statAddCatch, statAddSpawn, getCountAllCatch, getCountAllSpawn, version, getCountAllCatchShiny,getCountAllSpawnShiny, getCountAllCatchList, getCountAllSpawnList, getCountAllCatchShinyList, getCountAllSpawnShinyList, embedStat}