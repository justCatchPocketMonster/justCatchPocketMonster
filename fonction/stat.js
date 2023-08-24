const statBdd = require("../bdd/stat.json")
const pokeData = require("../bdd/pokemon.json");
const variableGlobal = require("../parameters/variableGlobal")
const nbPokemon = (pokeData.length);
const language = require("./language")
var version = variableGlobal.version;
const fs = require("fs")
const Discord = require("discord.js")
const catchError = require("./catchError")
const lockfile = require('lockfile');
const path = require('path');
const pagination = require("./pagination")


/**
 * Ajout +1 a l'index du pokemon dans la sauvegarde et créer la sauvegarde si elle n'existe pas et la met a jour si elle ne l'est pas
 * @param {int} idPokemon //id pour l'index
 */
 function statAddSpawn(idPokemon, isShiny, isMega){
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
 function statAddCatch(idPokemon, isShiny, isMega){
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
        let listPokemonCatched = getCount("CatchList", false, "All");
    
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
        let listPokemonSpawned = getCount("SpawnList", false, "All");;
    
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

function principalEmbedStat(interaction){
    mostLeastCatch = stringObjectPokemonMostAndLeastCatch(interaction);
    mostLeastSpawn = stringObjectPokemonMostAndLeastSpawn(interaction);



    let statEmbed = new Discord.EmbedBuilder()
        .setTitle("stats")
        .setColor("Purple")
        .addFields(
            {name: language.getText(interaction.guild.id, "nombreDeCaptureTotaly"), value: getCount("Catch", false)+"", inline:true},
            {name: language.getText(interaction.guild.id, "nombreDeCaptureShinyTotaly"), value: getCount("Catch", true)+"", inline:true}
            )
        .addFields(
            {name: language.getText(interaction.guild.id, "nombreDeSpawnTotaly"), value: getCount("Spawn", false)+"", inline:true},
            {name: language.getText(interaction.guild.id, "nombreDeSpawnShinyTotaly"), value: getCount("SpawnShiny", true)+"", inline:true}
            )
        .addFields(
            {name: language.getText(interaction.guild.id, "nombreDeCaptureVersion"), value: getCount("Catch", false, "Version")+"", inline:true},
            {name: language.getText(interaction.guild.id, "nombreDeCaptureShinyVersion"), value: getCount("Catch", true, "Version")+"", inline:true}
            )
        .addFields(
            {name: language.getText(interaction.guild.id, "nombreDeSpawnVersion"), value: getCount("Spawn", false, "Version")+"", inline:true},
            {name: language.getText(interaction.guild.id, "nombreDeSpawnShinyVersion"), value: getCount("Spawn", true, "Version")+"", inline:true}
            )
        .addFields(
            {name: language.getText(interaction.guild.id, "pokemonLeastCaught"), value: mostLeastCatch["least"], inline:true},
            {name: language.getText(interaction.guild.id, "pokemonMostCaught"), value: mostLeastCatch["most"], inline:true}
            )
        .addFields(
            {name: language.getText(interaction.guild.id, "pokemonLeastSpawn"), value: mostLeastSpawn["least"], inline:true},
            {name: language.getText(interaction.guild.id, "pokemonMostSpawn"), value: mostLeastSpawn["most"], inline:true}
            )

            return statEmbed;
}

/**classer les pokemon par rareté et par capture ou spawn et les ranges dans un tableau d'objet qui detient le nombre + un tableau des id des pokemon
 * 
 * @param {string} type est le niveau de rareté du poké (commun, legendaire, fabuleux)
 * @param {string} moinsOrPlus determine si c'est le top des plus ou des moins
 * @param {bool} catchOrSpawn determine si c'est le top des capture ou des spawn
 */
function topStat(type, moinsOrPlus, isCatch){

    let listPokemon
    
    if(isCatch){
        listPokemon = getCount("CatchList", false, "All");
    } else {
        listPokemon = getCount("SpawnList", false, "All");;
    }

    let listPokemonType = {};

    pokeData.forEach(pokemon => {

        if(pokemon.theType === type){
            listPokemonType[pokemon.id] = listPokemon[pokemon.id]
        }

    })
    listPokemonSort = [];

    //regarde si c'est le top des plus ou des moins et le tri
    if(moinsOrPlus === "moins"){
        listPokemonSort = Object.entries(listPokemonType).sort((a, b) => a[1] - b[1]);
    } else {
        listPokemonSort = Object.entries(listPokemonType).sort((a, b) => b[1] - a[1]);
    }

    listObjectPokemon = [];
    arrayCount = 0;
    nextPokemonSameCount = false;


    while(listPokemonSort.length != 0){


        if(listPokemonSort.length != 1 && listPokemonSort[0][1] == listPokemonSort[1][1]){
            nextPokemonSameCount = true;
        } else {
            nextPokemonSameCount = false;
        }

        if(listObjectPokemon[arrayCount] === undefined){
            listObjectPokemon[arrayCount] = {}
        }
        if(listObjectPokemon[arrayCount]["count"] === undefined){
            listObjectPokemon[arrayCount] = {"count": listPokemonSort[0][1]}
        }
        if(listObjectPokemon[arrayCount]["arrayIdPokemon"] == undefined){
            listObjectPokemon[arrayCount]["arrayIdPokemon"] = []
        }
        listObjectPokemon[arrayCount]["arrayIdPokemon"].push(listPokemonSort[0][0])

        //suppresion du pokemon actuel dans la liste
        listPokemonSort.splice(0, 1)

        if(!nextPokemonSameCount){
            arrayCount++;
        }
 
    }

    return listObjectPokemon;

}

function embedClassement(interaction, arraySortPokemon, title, color){

    count = 0;

    var embed = new Discord.EmbedBuilder()
        .setTitle(title)
        .setColor(color)

    arraySortPokemon.forEach( statPokemon => {
        count++;
        let textPokemon = "";
        let countId = 0;
        let limiteDepasse = false;

        if(count <= 21){
            statPokemon.arrayIdPokemon.forEach( idPokemon => {
                if(!limiteDepasse){
                    if(countId > 2){
                        if(countId == 3){

                            textPokemon+= "... (+ "+ (Number(statPokemon.arrayIdPokemon.length)-3).toString() +" autres)"
                        }
                        limiteDepasse = true;
                    } else {
                        textPokemon+= pokeData.find(pokemon => pokemon.id == idPokemon).name["name"+ language.getLanguage(interaction.guild.id)]+" "
                    }
                    countId++;
                }
            })

            embed.addFields(
                {name: count + ". "+statPokemon.count , value: textPokemon, inline:true},
                )

        }
        
    })
       
    return embed;

}

//TODO: géré les textes pour le pagination par langue

function embedStatGeneral(interaction){
try {
    
    arrayEmbed = [
        {
            "page": principalEmbedStat(interaction),
            "image": null,
            "information": {
                "nameSelection": language.getText(interaction.guild.id, "statMainPageName"),
                "descriptionSelection": language.getText(interaction.guild.id, "statMainPageDesc")
                }
        },
        {
            "page": null,
            "image": null,
            "information": {
                "nameSelection": "------"+language.getText(interaction.guild.id, "statCategoryOrdinary")+"------",
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("ordinaire", "moins", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"), "B22222"),
            "image": null,
            "information": {
                "nameSelection": "⬇️"+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("ordinaire", "plus", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "⬆️"+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("ordinaire", "moins", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"), "B22222"),
            "image": null,
            "information": {
                "nameSelection": "⬇️"+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("ordinaire", "plus", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "⬆️"+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": null,
            "image": null,
            "information": {
                "nameSelection": "------"+language.getText(interaction.guild.id, "statCategoryLegendary")+"------",
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("legendaire", "moins", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"), "B22222"),
            "image": null,
            "information": {
                "nameSelection": "⬇️"+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("legendaire", "plus", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "⬆️"+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("legendaire", "moins", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"), "B22222"),
            "image": null,
            "information": {
                "nameSelection": "⬇️"+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("legendaire", "plus", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "⬆️"+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": null,
            "image": null,
            "information": {
                "nameSelection": "------"+language.getText(interaction.guild.id, "statCategoryMythical")+"------",
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("fabuleux", "moins", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"), "B22222"),
            "image": null,
            "information": {
                "nameSelection": "⬇️"+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("fabuleux", "plus", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "⬆️"+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("fabuleux", "moins", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"), "B22222"),
            "image": null,
            "information": {
                "nameSelection": "⬇️"+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("fabuleux", "plus", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "⬆️"+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"),
                "descriptionSelection": ""
                }
        },
    ]

    pagination.paginationMenu(interaction,"textDefault", arrayEmbed)
    
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

        // on recommence mais spécifiquement pour les forms

        form = variableGlobal.form

        form.forEach(formName => {
            if(statBdd["All"][formName] === undefined){
                statBdd["All"][formName] = {};
            }
            if(statBdd[version][formName] === undefined){
                statBdd[version][formName] = {};
            }
            

        if(statBdd["All"][formName]["pokemonSpawned"] === undefined){
            statBdd["All"][formName]["pokemonSpawned"] = 0;
        }
        if(statBdd["All"][formName]["pokemonCatched"] === undefined){
            statBdd["All"][formName]["pokemonCatched"] = 0;
        }
        if(statBdd["All"][formName]["pokemonSpawnedShiny"] === undefined){
            statBdd["All"][formName]["pokemonSpawnedShiny"] = 0;
        }
        if(statBdd["All"][formName]["pokemonCatchedShiny"] === undefined){
            statBdd["All"][formName]["pokemonCatchedShiny"] = 0;
        }
        if(statBdd["All"][formName]["listPokemonSpawned"] === undefined){
            statBdd["All"][formName]["listPokemonSpawned"] = {};
        }
        if(statBdd["All"][formName]["listPokemonCatched"] === undefined){
            statBdd["All"][formName]["listPokemonCatched"] = {};
        }
        if(statBdd["All"][formName]["listPokemonSpawnedShiny"] === undefined){
            statBdd["All"][formName]["listPokemonSpawnedShiny"] = {};
        }
        if(statBdd["All"][formName]["listPokemonCatchedShiny"] === undefined){
            statBdd["All"][formName]["listPokemonCatchedShiny"] = {};
        }
        if(statBdd[version][formName]["pokemonSpawned"] === undefined){
            statBdd[version][formName]["pokemonSpawned"] = 0;
        }
        if(statBdd[version][formName]["pokemonCatched"] === undefined){
            statBdd[version][formName]["pokemonCatched"] = 0;
        }
        if(statBdd[version][formName]["pokemonSpawnedShiny"] === undefined){
            statBdd[version][formName]["pokemonSpawnedShiny"] = 0;
        }
        if(statBdd[version][formName]["pokemonCatchedShiny"] === undefined){
            statBdd[version][formName]["pokemonCatchedShiny"] = 0;
        }
        if(statBdd[version][formName]["listPokemonSpawned"] === undefined){
            statBdd[version][formName]["listPokemonSpawned"] = {};
        }
        if(statBdd[version][formName]["listPokemonCatched"] === undefined){
            statBdd[version][formName]["listPokemonCatched"] = {};
        }
        if(statBdd[version][formName]["listPokemonSpawnedShiny"] === undefined){
            statBdd[version][formName]["listPokemonSpawnedShiny"] = {};
        }
        if(statBdd[version][formName]["listPokemonCatchedShiny"] === undefined){
            statBdd[version][formName]["listPokemonCatchedShiny"] = {};
        }
    })
    
    
    
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
        //recommence mais que pour les forms

        form = variableGlobal.form

        for(let y = 1; y < nbPokemon; y++){
            form.forEach(formName => {
                

                if(pokeData[y]["pokemonForm"][formName] !== undefined){
                
                    if(statBdd["All"][formName]["listPokemonSpawned"][y]=== undefined){
                        statBdd["All"][formName]["listPokemonSpawned"][y] = 0;
                    } else {
                        statBdd["All"][formName]["listPokemonSpawned"][y] = statBdd["All"]["listPokemonSpawned"][y];
                    }
                    if(statBdd["All"][formName]["listPokemonSpawnedShiny"][y]=== undefined){
                        statBdd["All"][formName]["listPokemonSpawnedShiny"][y] = 0;
                    } else {
                        statBdd["All"][formName]["listPokemonSpawnedShiny"][y] = statBdd["All"]["listPokemonSpawnedShiny"][y];
                    }
                    if(statBdd[version][formName]["listPokemonSpawned"][y]=== undefined){
                        statBdd[version][formName]["listPokemonSpawned"][y] = 0;
                    } else {
                        statBdd[version][formName]["listPokemonSpawned"][y] = statBdd[version]["listPokemonSpawned"][y];
                    }
                    
                    if(statBdd[version][formName]["listPokemonSpawnedShiny"][y]=== undefined){
                        statBdd[version][formName]["listPokemonSpawnedShiny"][y] = 0;
                    } else {
                        statBdd[version][formName]["listPokemonSpawnedShiny"][y] = statBdd[version]["listPokemonSpawnedShiny"][y];
                    }
                }
            })
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


        
        //recommence mais que pour les forms

        form = variableGlobal.form

        for(let y = 1; y < nbPokemon; y++){
            form.forEach(formName => {
                

                if(pokeData[y]["pokemonForm"][formName] !== undefined){
                
                    if(statBdd["All"][formName]["listPokemonCatched"][y]=== undefined){
                        statBdd["All"][formName]["listPokemonCatched"][y] = 0;
                    } else {
                        statBdd["All"][formName]["listPokemonCatched"][y] = statBdd["All"]["listPokemonSpawned"][y];
                    }
                    if(statBdd["All"][formName]["listPokemonCatchedShiny"][y]=== undefined){
                        statBdd["All"][formName]["listPokemonCatchedShiny"][y] = 0;
                    } else {
                        statBdd["All"][formName]["listPokemonCatchedShiny"][y] = statBdd["All"]["listPokemonSpawnedShiny"][y];
                    }
                    if(statBdd[version][formName]["listPokemonCatched"][y]=== undefined){
                        statBdd[version][formName]["listPokemonCatched"][y] = 0;
                    } else {
                        statBdd[version][formName]["listPokemonCatched"][y] = statBdd[version]["listPokemonSpawned"][y];
                    }
                    
                    if(statBdd[version][formName]["listPokemonCatchedShiny"][y]=== undefined){
                        statBdd[version][formName]["listPokemonCatchedShiny"][y] = 0;
                    } else {
                        statBdd[version][formName]["listPokemonCatchedShiny"][y] = statBdd[version]["listPokemonSpawnedShiny"][y];
                    }
                }
            })
        }


        SaveBdd();
} catch(error) {

        catchError.saveError(null, null, "stat.js", "updateNumberPossibilityCatched", error)
        console.error(error)
    }
    
}

function getCount(isList, isSpawn, isShiny, version = "All", form = null) {
    try {
        createStatVersion();
        updateNumberPossibilityCatched(); 
        

        let statKey;
        if (version == "All") {
            statKey = "All";
        } else {
            statKey = version;
        }

        let listText = "";
        if(isList){
            listText = "list";
        }

        let spawnText = "";
        if(isSpawn){
            spawnText = "Spawned";
        } else {
            spawnText = "Catched";
        }

        let shinyText = "";
        if(isShiny){
            shinyText = "Shiny";
        }

        if(isList){
            countKey = listText+"Pokemon"+spawnText+shinyText;
        } else {
            countKey = "pokemon"+spawnText+shinyText;
        }
        

        if(form !== null){
            return statBdd[statKey][form][countKey];

        } else {
            return statBdd[statKey][countKey];
        }
    } catch (error) {
        catchError.saveError(null, null, "stat.js", functionName, error);
        console.error(error);
    }
}


function SaveBdd(){

    const lockfilePath = path.join(__dirname,"..", 'lock', 'stat.lock');

    try{
        lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
            if (err) {
                console.error('Erreur lors du verrouillage du fichier :', err);
                return;
            }
        fs.writeFile(path.join(__dirname,"..", 'bdd', 'stat.json'), JSON.stringify(statBdd, null, 4), (err)=> {
            if (err)console.log("erreur")

            lockfile.unlock(lockfilePath, (err) => {
                if (err) {
                    console.error('Erreur lors du déverrouillage du fichier :', err);
                }
            });
        });
    });
    } catch(e) {

        catchError.saveError(null, null, "stat.js", "SaveBdd", e)
        console.error(e)
    }

}

module.exports = {getCount, statAddCatch, statAddSpawn, getCountAllCatch, getCountAllSpawn, version, getCountAllCatchShiny,getCountAllSpawnShiny, getCountAllCatchList, getCountAllSpawnList, getCountAllCatchShinyList, getCountAllSpawnShinyList, embedStatGeneral}