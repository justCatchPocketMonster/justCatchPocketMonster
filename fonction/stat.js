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
const pagination = require("./pagination");
const { fips } = require("crypto");


/**
 * Ajout +1 a l'index du pokemon dans la sauvegarde et créer la sauvegarde si elle n'existe pas et la met a jour si elle ne l'est pas
 * @param {int} idPokemon //id pour l'index
 */
 function statAddSpawn(idPokemon, isShiny, form = null){
try {
    
        createStatVersion()
    
        if(statBdd[version]["listPokemonSpawned"] === null){
            updateNumberPossibilitySpawned();
        } else {
            if(statBdd[version]["listPokemonSpawned"][nbPokemon] === null){
                updateNumberPossibilitySpawned();
            }
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

        if(form != null){
            if(statBdd[version][form]["listPokemonSpawned"] === undefined ){
                updateNumberPossibilitySpawned();
            } else {
                if(statBdd[version][form]["listPokemonSpawned"][idPokemon] === undefined){
                updateNumberPossibilitySpawned();
                }
            }
            statBdd[version][form]["pokemonSpawned"]+=1;
            statBdd["All"][form]["pokemonSpawned"]+=1;
            statBdd[version][form]["listPokemonSpawned"][idPokemon]+=1;
            statBdd["All"][form]["listPokemonSpawned"][idPokemon]+=1;
            if(isShiny){
                statBdd[version][form]["pokemonSpawnedShiny"]+=1;
                statBdd["All"][form]["pokemonSpawnedShiny"]+=1;
                statBdd[version][form]["listPokemonSpawnedShiny"][idPokemon]+=1;
                statBdd["All"][form]["listPokemonSpawnedShiny"][idPokemon]+=1;
            }
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
 function statAddCatch(idPokemon, isShiny, form = null){
try {
    
        createStatVersion()
        if(statBdd[version]["listPokemonCatched"] === undefined ){
            updateNumberPossibilityCatched();
        } else {
            if(statBdd[version]["listPokemonCatched"][idPokemon] === undefined){
                updateNumberPossibilityCatched();
            }
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

        if(form != null){
            if(statBdd[version][form]["listPokemonCatched"] === undefined ){
                updateNumberPossibilityCatched();
            } else {
                if(statBdd[version][form]["listPokemonCatched"][idPokemon] === undefined){
                    updateNumberPossibilityCatched();
                }
            }
            statBdd[version][form]["pokemonCatched"]+=1;
            statBdd["All"][form]["pokemonCatched"]+=1;
            statBdd[version][form]["listPokemonCatched"][idPokemon]+=1;
            statBdd["All"][form]["listPokemonCatched"][idPokemon]+=1;
            if(isShiny){
                statBdd[version][form]["pokemonCatchedShiny"]+=1;
                statBdd["All"][form]["pokemonCatchedShiny"]+=1;
                statBdd[version][form]["listPokemonCatchedShiny"][idPokemon]+=1;
                statBdd["All"][form]["listPokemonCatchedShiny"][idPokemon]+=1;
            }
        }
        SaveBdd();
} catch(error) {

        catchError.saveError(null, null, "stat.js", "statAddCatch", error)
        console.error(error)
    }
}

function stringObjectPokemonMostAndLeastCatch(interaction){
try {
        let listPokemonCatched = getCount(true, false, false);
    
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
                pokemon = JSON.parse(JSON.stringify(pokeData.find(pokemon => pokemon.id == idPokemon)))

                chosenLeastPokemonCatch += pokemon.name["name"+ language.getLanguage(interaction.guild.id)]+" "
    
                
            })
            chosenLeastPokemonCatch += ": "+ leastPokemonCatch.nbCapture
        }
        if(mostPokemonCatch.listPokemon.length > 3){
            chosenMostPokemonCatch = language.getText(interaction.guild.id, "tooMuchPokemon")+" : " + mostPokemonCatch.nbCapture;
    
        } else {
            mostPokemonCatch.listPokemon.forEach( idPokemon => {
                pokemon = JSON.parse(JSON.stringify(pokeData.find(pokemon => pokemon.id == idPokemon)))
                chosenMostPokemonCatch += pokemon.name["name"+ language.getLanguage(interaction.guild.id)]+" "
            
                
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
        let listPokemonSpawned = getCount(true, true, false)
    
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
                pokemon = JSON.parse(JSON.stringify(pokeData.find(pokemon => pokemon.id == idPokemon)))
                chosenLeastPokemonSpawn += pokemon.name["name"+ language.getLanguage(interaction.guild.id)]+" "
    
                
            })
            chosenLeastPokemonSpawn += ": "+ leastPokemonSpawn.nbCapture
        }
        if(mostPokemonSpawn.listPokemon.length > 3){
            chosenMostPokemonSpawn = language.getText(interaction.guild.id, "tooMuchPokemon")+" : " + mostPokemonSpawn.nbCapture;
    
        } else {
            mostPokemonSpawn.listPokemon.forEach( idPokemon => {
                pokemon = JSON.parse(JSON.stringify(pokeData.find(pokemon => pokemon.id == idPokemon)))
                chosenMostPokemonSpawn += pokemon.name["name"+ language.getLanguage(interaction.guild.id)]+" "
            
                
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
            {name: language.getText(interaction.guild.id, "nombreDeCaptureTotaly"), value: getCount(false, false, false)+"", inline:true},
            {name: language.getText(interaction.guild.id, "nombreDeCaptureShinyTotaly"), value: getCount(false, false, true)+"", inline:true}
            )
        .addFields(
            {name: language.getText(interaction.guild.id, "nombreDeSpawnTotaly"), value: getCount(false, true, false)+"", inline:true},
            {name: language.getText(interaction.guild.id, "nombreDeSpawnShinyTotaly"), value:getCount(false, true, true)+"", inline:true}
            )
        .addFields(
            {name: language.getText(interaction.guild.id, "nombreDeCaptureVersion"), value: getCount(false, false, false, "version")+"", inline:true},
            {name: language.getText(interaction.guild.id, "nombreDeCaptureShinyVersion"), value: getCount(false, false, true, "version")+"", inline:true}
            )
        .addFields(
            {name: language.getText(interaction.guild.id, "nombreDeSpawnVersion"), value: getCount(false, true, false, "version")+"", inline:true},
            {name: language.getText(interaction.guild.id, "nombreDeSpawnShinyVersion"), value: getCount(false, true, true, "version")+"", inline:true}
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
        listPokemon = getCount(true, false, false);
    } else {
        listPokemon = getCount(true, true, false);
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

/**classer les pokemon par rareté et par capture ou spawn et les ranges dans un tableau d'objet qui detient le nombre + un tableau des id des pokemon
 * 
 * @param {string} type est le niveau de rareté du poké (commun, legendaire, fabuleux)
 * @param {string} moinsOrPlus determine si c'est le top des plus ou des moins
 * @param {bool} catchOrSpawn determine si c'est le top des capture ou des spawn
 */
function topStatForm(form, moinsOrPlus, isCatch){

    let listPokemon
    
    if(isCatch){
        listPokemon = getCount(true, false, false, "All", form);
    } else {
        listPokemon = getCount(true, true, false, "All", form);
    }

    let listPokemonType = {};

    pokeData.forEach(pokemon => {

        if(pokemon.pokemonForm.hasOwnProperty(form)){
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
                "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("ordinaire", "plus", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("ordinaire", "moins", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"), "B22222"),
            "image": null,
            "information": {
                "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("ordinaire", "plus", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"),
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
                "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("legendaire", "plus", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("legendaire", "moins", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"), "B22222"),
            "image": null,
            "information": {
                "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("legendaire", "plus", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"),
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
                "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("fabuleux", "plus", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("fabuleux", "moins", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"), "B22222"),
            "image": null,
            "information": {
                "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStat("fabuleux", "plus", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"),
                "descriptionSelection": ""
                }
        },


        {
            "page": null,
            "image": null,
            "information": {
                "nameSelection": "------"+language.getText(interaction.guild.id, "statCategoryMega")+"------",
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStatForm("mega", "moins", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMega"), "B22222"),
            "image": null,
            "information": {
                "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMega"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStatForm("mega", "plus", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMega"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMega"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStatForm("mega", "moins", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMega"), "B22222"),
            "image": null,
            "information": {
                "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMega"),
                "descriptionSelection": ""
                }
        },
        {
            "page": embedClassement(interaction, topStatForm("mega", "plus", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMega"), "32CD32"),
            "image": null,
            "information": {
                "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMega"),
                "descriptionSelection": ""
                }
        },
    ]

    pagination.paginationMenu(interaction,language.getText(interaction.guild.id, "selectAPage"), arrayEmbed)
    
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
            if(statBdd["All"]["listPokemonSpawned"][pokeData[i].id]=== undefined){
                statBdd["All"]["listPokemonSpawned"][pokeData[i].id] = 0;
            } else {
                statBdd["All"]["listPokemonSpawned"][pokeData[i].id] = statBdd["All"]["listPokemonSpawned"][pokeData[i].id];
            }
            if(statBdd["All"]["listPokemonSpawnedShiny"][pokeData[i].id]=== undefined){
                statBdd["All"]["listPokemonSpawnedShiny"][pokeData[i].id] = 0;
            } else {
                statBdd["All"]["listPokemonSpawnedShiny"][pokeData[i].id] = statBdd["All"]["listPokemonSpawnedShiny"][pokeData[i].id];
            }
            if(statBdd[version]["listPokemonSpawned"][pokeData[i].id]=== undefined){
                statBdd[version]["listPokemonSpawned"][pokeData[i].id] = 0;
            } else {
                statBdd[version]["listPokemonSpawned"][pokeData[i].id] = statBdd[version]["listPokemonSpawned"][pokeData[i].id];
            }
            
            if(statBdd[version]["listPokemonSpawnedShiny"][pokeData[i].id]=== undefined){
                statBdd[version]["listPokemonSpawnedShiny"][pokeData[i].id] = 0;
            } else {
                statBdd[version]["listPokemonSpawnedShiny"][pokeData[i].id] = statBdd[version]["listPokemonSpawnedShiny"][pokeData[i].id];
            }
            
        }
        //recommence mais que pour les forms

        form = variableGlobal.form

        for(let y = 1; y < nbPokemon; y++){
            form.forEach(formName => {
                

                if(pokeData[y]["pokemonForm"][formName] !== undefined){
                
                    if(statBdd["All"][formName]["listPokemonSpawned"][pokeData[y].id]=== undefined){
                        statBdd["All"][formName]["listPokemonSpawned"][pokeData[y].id] = 0;
                    } else {
                        statBdd["All"][formName]["listPokemonSpawned"][pokeData[y].id] = statBdd["All"][formName]["listPokemonSpawned"][pokeData[y].id];
                    }
                    if(statBdd["All"][formName]["listPokemonSpawnedShiny"][pokeData[y].id]=== undefined){
                        statBdd["All"][formName]["listPokemonSpawnedShiny"][pokeData[y].id] = 0;
                    } else {
                        statBdd["All"][formName]["listPokemonSpawnedShiny"][pokeData[y].id] = statBdd["All"][formName]["listPokemonSpawnedShiny"][pokeData[y].id];
                    }
                    if(statBdd[version][formName]["listPokemonSpawned"][pokeData[y].id]=== undefined){
                        statBdd[version][formName]["listPokemonSpawned"][pokeData[y].id] = 0;
                    } else {
                        statBdd[version][formName]["listPokemonSpawned"][pokeData[y].id] = statBdd[version][formName]["listPokemonSpawned"][pokeData[y].id];
                    }
                    
                    if(statBdd[version][formName]["listPokemonSpawnedShiny"][pokeData[y].id]=== undefined){
                        statBdd[version][formName]["listPokemonSpawnedShiny"][pokeData[y].id] = 0;
                    } else {
                        statBdd[version][formName]["listPokemonSpawnedShiny"][pokeData[y].id] = statBdd[version][formName]["listPokemonSpawnedShiny"][pokeData[y].id];
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
            if(statBdd["All"]["listPokemonCatched"][pokeData[i].id]=== undefined){
                statBdd["All"]["listPokemonCatched"][pokeData[i].id] = 0;
            }else {
                statBdd["All"]["listPokemonCatched"][pokeData[i].id] = statBdd["All"]["listPokemonCatched"][pokeData[i].id];
            }
            if(statBdd["All"]["listPokemonCatchedShiny"][pokeData[i].id]=== undefined){
                statBdd["All"]["listPokemonCatchedShiny"][pokeData[i].id] = 0;
            }else {
                statBdd["All"]["listPokemonCatchedShiny"][pokeData[i].id] = statBdd["All"]["listPokemonCatchedShiny"][pokeData[i].id];
            }
            if(statBdd[version]["listPokemonCatched"][pokeData[i].id]=== undefined){
                statBdd[version]["listPokemonCatched"][pokeData[i].id] = 0;
            }else {
                statBdd[version]["listPokemonCatched"][pokeData[i].id] = statBdd[version]["listPokemonCatched"][pokeData[i].id];
            }
            
            if(statBdd[version]["listPokemonCatchedShiny"][pokeData[i].id]=== undefined){
                statBdd[version]["listPokemonCatchedShiny"][pokeData[i].id] = 0;
            }else {
                statBdd[version]["listPokemonCatchedShiny"][pokeData[i].id] = statBdd[version]["listPokemonCatchedShiny"][pokeData[i].id];
            }
            
        }


        
        //recommence mais que pour les forms

        form = variableGlobal.form

        for(let y = 1; y < nbPokemon; y++){
            form.forEach(formName => {
                

                if(pokeData[y]["pokemonForm"][formName] !== undefined){
                
                    if(statBdd["All"][formName]["listPokemonCatched"][pokeData[y].id]=== undefined){
                        statBdd["All"][formName]["listPokemonCatched"][pokeData[y].id] = 0;
                    } else {
                        statBdd["All"][formName]["listPokemonCatched"][pokeData[y].id] = statBdd["All"][formName]["listPokemonSpawned"][pokeData[y].id];
                    }
                    if(statBdd["All"][formName]["listPokemonCatchedShiny"][pokeData[y].id]=== undefined){
                        statBdd["All"][formName]["listPokemonCatchedShiny"][pokeData[y].id] = 0;
                    } else {
                        statBdd["All"][formName]["listPokemonCatchedShiny"][pokeData[y].id] = statBdd["All"][formName]["listPokemonSpawnedShiny"][pokeData[y].id];
                    }
                    if(statBdd[version][formName]["listPokemonCatched"][pokeData[y].id]=== undefined){
                        statBdd[version][formName]["listPokemonCatched"][pokeData[y].id] = 0;
                    } else {
                        statBdd[version][formName]["listPokemonCatched"][pokeData[y].id] = statBdd[version][formName]["listPokemonSpawned"][pokeData[y].id];
                    }
                    
                    if(statBdd[version][formName]["listPokemonCatchedShiny"][pokeData[y].id]=== undefined){
                        statBdd[version][formName]["listPokemonCatchedShiny"][pokeData[y].id] = 0;
                    } else {
                        statBdd[version][formName]["listPokemonCatchedShiny"][pokeData[y].id] = statBdd[version][formName]["listPokemonSpawnedShiny"][pokeData[y].id];
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
        updateNumberPossibilitySpawned();

        

        let statKey;
        if (version == "All") {
            statKey = "All";
        } else {
            statKey = variableGlobal.version;
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
        catchError.saveError(null, null, "stat.js", "getCount", error);
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

module.exports = {getCount, statAddCatch, statAddSpawn, embedStatGeneral}