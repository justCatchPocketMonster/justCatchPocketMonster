/**
 * les bdds
 */
const pokeData = require("../bdd/pokemon.json");
const language = require("../fonction/language")
const eventStat = require("../fonction/eventStatChange")

/**
 * Les fichier requis (pour les fonctions)
 */
 const fonctionJs = require("../fonction/fonctionJs");
 const index = require("../index")
 const variableGlobal = require("../parameters/variableGlobal")
 const nbPokemon = pokeData.length;
 const valeurMaxRandom = variableGlobal.valeurMaxRandom+1;
 const savePokemonServer = require("../fonction/pokedexSaveServer");
const { eventSelect } = require("../fonction/eventChoice");

/**
 * avec un int resort le type de pokemon
 */

function raritySelect(idServer){

    let numberRandom = fonctionJs.getRandomInt(valeurMaxRandom);

    let somRarity = eventStat.getStat(idServer, "rarity", "normal");

    if(numberRandom <= somRarity){
        return "ordinaire";
    } else {
        somRarity += eventStat.getStat(idServer, "rarity", "legendaire")
        if(numberRandom <= somRarity){
            return "legendaire";
        } else {
            somRarity += eventStat.getStat(idServer, "rarity", "fabuleux")
            if(numberRandom <= somRarity){
                return "fabuleux";
            }
        }
    }
    
    
}


 function pokemonChoiceGen(pokeList, gen){
    let pokemonSelected = []
    pokeList.forEach(pokemon => {
        if(pokemon["gen"] === gen){
            pokemonSelected.push(pokemon)
        }
    })

    if(pokemonSelected[0] === undefined){
        return []
    }

    return pokemonSelected
 }

 
 function pokemonChoiceTypeRarity(pokeList, typeRarity){
    let pokemonSelected = []
    pokeList.forEach(pokemon => {
        if(pokemon["theType"] === typeRarity){
            pokemonSelected.push(pokemon)
        }
    })

    if(pokemonSelected[0] === undefined){
        return []
    }

    return pokemonSelected
 }

 function pokemonChoiceType(pokeList, type){
    let pokemonSelected = []
    pokeList.forEach(pokemon => {
        if(pokemon["typeListEng"].includes(type)){
            pokemonSelected.push(pokemon)
        }
    })

    if(pokemonSelected[0] === undefined){
        return []
    }

    return pokemonSelected
 }


 /**
  * resort un objet "pokemon" aléatoire
  */

function pokemonSelect(idServer){

    arrayPokemon = pokeData;

    do{
        
        arrayPokemonPass1 = pokemonChoiceGen(arrayPokemon, generationSelect(idServer))

    }while(arrayPokemonPass1[0] === undefined)


    do{
        
        arrayPokemonPass2 = pokemonChoiceTypeRarity(arrayPokemonPass1, raritySelect(idServer))

    }while(arrayPokemonPass2[0] === undefined)


    do{
        
        arrayPokemonPass3 = pokemonChoiceType(arrayPokemonPass2, typeSelect(idServer))

    }while(arrayPokemonPass3[0] === undefined)

    let pokemonChoiced = arrayPokemonPass3[(fonctionJs.getRandomInt(arrayPokemonPass3.length))];


    return(pokemonChoiced)
}


function typeSelect(idServer){
    randomNumber = (fonctionJs.getRandomInt(variableGlobal.nbType*100)+1)

    let somStatByType = eventStat.getStat(idServer, "type", "acier")

    if(randomNumber <= somStatByType){
        return "Steel"
    }else {
        somStatByType+= eventStat.getStat(idServer, "type", "dragon");
        if(randomNumber <= somStatByType){
            return "Dragon"
        }else{
            somStatByType+= eventStat.getStat(idServer, "type", "electrik");
            if(randomNumber <= somStatByType){
            return "Electric"
            }else {
                somStatByType+= eventStat.getStat(idServer, "type", "feu");
                if(randomNumber <= somStatByType){
                    return "Fire"
                }else {
                    somStatByType+= eventStat.getStat(idServer, "type", "insecte");
                    if(randomNumber <= somStatByType){
                        return "Bug"
                    }else {
                        somStatByType+= eventStat.getStat(idServer, "type", "plante");
                        if(randomNumber <= somStatByType){
                            return "Grass"
                        }else {
                            somStatByType+= eventStat.getStat(idServer, "type", "psy");
                            if(randomNumber <= somStatByType){
                                return "Psychic"
                            }else{
                                somStatByType+= eventStat.getStat(idServer, "type", "sol");
                                if(randomNumber <= somStatByType){
                                    return "Ground"
                                }else{
                                    somStatByType+= eventStat.getStat(idServer, "type", "tenebres");
                                    if(randomNumber <= somStatByType){
                                        return "Dark"
                                    }else{
                                        somStatByType+= eventStat.getStat(idServer, "type", "combat");
                                        if(randomNumber <= somStatByType){
                                            return "Fighting"
                                        }else{
                                            somStatByType+= eventStat.getStat(idServer, "type", "eau");
                                            if(randomNumber <= somStatByType){
                                                return "Water"
                                            }else{
                                                somStatByType+= eventStat.getStat(idServer, "type", "fee");
                                                if(randomNumber <= somStatByType){
                                                    return "Fairy"
                                                }else{
                                                    somStatByType+= eventStat.getStat(idServer, "type", "glace");
                                                    if(randomNumber <= somStatByType){
                                                        return "Ice"
                                                    }else{
                                                        somStatByType+= eventStat.getStat(idServer, "type", "normal");
                                                        if(randomNumber <= somStatByType){
                                                            return "Normal"
                                                        }else{
                                                            somStatByType+= eventStat.getStat(idServer, "type", "poison");
                                                            if(randomNumber <= somStatByType){
                                                                return "Poison"
                                                            }else{
                                                                somStatByType+= eventStat.getStat(idServer, "type", "roche");
                                                                if(randomNumber <= somStatByType){
                                                                    return "Rock"
                                                                }else{
                                                                    somStatByType+= eventStat.getStat(idServer, "type", "spectre");
                                                                    if(randomNumber <= somStatByType){
                                                                        return "Ghost"
                                                                    }else{
                                                                        somStatByType+= eventStat.getStat(idServer, "type", "vol");
                                                                        if(randomNumber <= somStatByType){
                                                                            return "Flying"
                                                                        }else {
                                                                            console.log("erreur dans le choix de la génération")
                                                                            return 0;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}

function generationSelect(idServer){
    randomNumber = (fonctionJs.getRandomInt(variableGlobal.nbGeneration*100)+1)

    let somStatByGen = eventStat.getStat(idServer, "gen", "1");

    if(randomNumber <= somStatByGen){
        return 1
    }else {
        somStatByGen += eventStat.getStat(idServer, "gen", "2");
        if(randomNumber <= somStatByGen){
            return 2
        }else 
            {
                somStatByGen += eventStat.getStat(idServer, "gen", "3");
                if(randomNumber <= somStatByGen){
                return 3
            }else 
                {
                    somStatByGen += eventStat.getStat(idServer, "gen", "4");
                    if(randomNumber <= somStatByGen){
                    return 4
                }else 
                    {
                        somStatByGen += eventStat.getStat(idServer, "gen", "5");
                        if(randomNumber <= somStatByGen){
                        return 5
                    }else 
                        {
                            somStatByGen += eventStat.getStat(idServer, "gen", "6");
                            if(randomNumber <= somStatByGen){
                            return 6
                        }else 
                            {
                                somStatByGen += eventStat.getStat(idServer, "gen", "7");
                                if(randomNumber <= somStatByGen){
                                return 7
                            }else 
                                {
                                    somStatByGen += eventStat.getStat(idServer, "gen", "8");
                                    if(randomNumber <= somStatByGen){
                                    return 8
                                }else 
                                    {
                                        somStatByGen += eventStat.getStat(idServer, "gen", "9");
                                        if(randomNumber <= somStatByGen){
                                        return 9
                                    }else {
                                        console.log("erreur dans le choix de la génération")
                                        return 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


}



/**
 * sert à choisie si le pokemon a le caractère shiny
 * @param {le pokemon} pokemon 
 * @param {L'id du serveur afin d'identifier pour faire varier le taux de shiny} idServer 
 * @param {pour envoyé des messages} message 
 * @returns le pokemon avec le caractère shiny en format booléen plus
 */
function shinySelect(pokemon, idServer, message){
    
    let tauxShiny = eventStat.getGeneralStat(idServer, "shiny");
    let saveServer = savePokemonServer.getSave(idServer);


    if(saveServer[pokemon["id"]] >= 100){
        tauxShiny /= 2;
    } else if(saveServer[pokemon["id"]] >= 75){
        tauxShiny /= 1.80;
    }else if(saveServer[pokemon["id"]] >= 50){
        tauxShiny /= 1.60;
    }else if(saveServer[pokemon["id"]] >= 30){
        tauxShiny /= 1.40;
    }else if(saveServer[pokemon["id"]] >= 20){
        tauxShiny /= 1.30;
    }else if(saveServer[pokemon["id"]] >= 10){
        tauxShiny /= 1.20;
    }else if(saveServer[pokemon["id"]] >= 5){
        tauxShiny /= 1.15;
    }else if(saveServer[pokemon["id"]] >= 3){
        tauxShiny /= 1.10;
    }

    let nbRandomShiny = fonctionJs.getRandomInt(tauxShiny)

    if(nbRandomShiny === 1){
        pokemon["isShiny"] =  true;
    } else {
        pokemon["isShiny"] =  false;
    }
    return pokemon
}

/**
 * getter pour récup un nom du pokemon avec son id
 * @param {l'id du pokemon} id 
 * @param {permet d'identifié le serveur pour avoir le pokemon avec le bonne langue} idServer 
 * @returns retourne le nom du poke ou null si le poké est inexistant
 */
function getNamePokemon(id, idServer){
    if(pokeData[id]!= undefined){

        return pokeData[id]["name"]["name"+language.getLanguage(idServer)];
    } else {
        return null;
    }
}


module.exports = {pokemonSelect, getNamePokemon, shinySelect}
