import { EmbedBuilder } from "discord.js";
import {Stat} from "../../core/classes/Stat";
import { paginationMenu } from "../other/paginationMenu";

export default function createPaginationStat(actualVersionStat: Stat, generalVersionStat: Stat) {

            const arrayEmbed = [
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
                    "page": embedClassement(topStat("ordinaire", "moins", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"), "B22222"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStat("ordinaire", "plus", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"), "32CD32"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStat("ordinaire", "moins", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"), "B22222"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStat("ordinaire", "plus", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryOrdinary"), "32CD32"),
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
                    "page": embedClassement(topStat("legendaire", "moins", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"), "B22222"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStat("legendaire", "plus", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"), "32CD32"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStat("legendaire", "moins", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"), "B22222"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStat("legendaire", "plus", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryLegendary"), "32CD32"),
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
                    "page": embedClassement(topStat("fabuleux", "moins", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"), "B22222"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStat("fabuleux", "plus", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"), "32CD32"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStat("fabuleux", "moins", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"), "B22222"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStat("fabuleux", "plus", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMythical"), "32CD32"),
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
                    "page": embedClassement(topStatForm("mega", "moins", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMega"), "B22222"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMega"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStatForm("mega", "plus", true), language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMega"), "32CD32"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopCatches")+ " "+language.getText(interaction.guild.id, "statCategoryMega"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStatForm("mega", "moins", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMega"), "B22222"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔽 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMega"),
                        "descriptionSelection": ""
                    }
                },
                {
                    "page": embedClassement(topStatForm("mega", "plus", false), language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMega"), "32CD32"),
                    "image": null,
                    "information": {
                        "nameSelection": "🔼 "+language.getText(interaction.guild.id, "statTopSpawns")+ " "+language.getText(interaction.guild.id, "statCategoryMega"),
                        "descriptionSelection": ""
                    }
                },
            ]

            paginationMenu(interaction,language.getText(interaction.guild.id, "selectAPage"), arrayEmbed)



}

function embedClassement(arraySortPokemon, title, color){

    let count = 0;

    var embed = new EmbedBuilder()
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

class stat{

    static stringObjectPokemonMostAndLeastCatch(interaction){
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

    static stringObjectPokemonMostAndLeastSpawn(interaction){
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

    static principalEmbedStat(interaction){
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
    static topStat(type, moinsOrPlus, isCatch){

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
    static topStatForm(form, moinsOrPlus, isCatch){

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

    static getCount(isList, isSpawn, isShiny, version = "All", form = null) {
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


    static SaveBdd(){

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
}

module.exports = stat;