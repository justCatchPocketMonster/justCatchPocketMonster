/**
 * les bdds
 */
const pokeData = require("../bdd/pokemon.json");
const language = require("../fonction/language")

/**
 * Les fichier requis (pour les fonctions)
 */
 const fonctionJs = require("../fonction/fonctionJs");
 const index = require("../index")
 const variableGlobal = require("../parameters/variableGlobal")
 const nbPokemon = pokeData.length;
 const valeurMaxRandom = variableGlobal.valeurMaxRandom+1;
 const savePokemonServer = require("../fonction/pokedexSaveServer")

/**
 * avec un int resort le type de pokemon
 */

function typeIntToStr(nb){

    if(nb <= variableGlobal.valeurMaxOrdinaire){
        return "ordinaire";
    }
    if(nb <= variableGlobal.valeurMaxLegendaire){
        return "legendaire";
    }
    if(nb <= variableGlobal.valeurMaxFabuleux){
        return "fabuleux";
    }
}

/**
 * vérifie si le type correspond avec l'id et true si ça n'est pas le cas
 */

 function pokemonChoice(type, gen, typeReal){
    let pokemonSelected = []
    pokeData.forEach(pokemon =>{
        if(pokemon["gen"] === gen){
            if(pokemon["theType"] === type){
                if(pokemon["typeListEng"].includes(typeReal)){
                    pokemonSelected.push(pokemon)
                }
                
            }
        }
    })

    if(pokemonSelected[0] === undefined){
        return {}
    }
    let pokemonDoSpawn = pokemonSelected[(fonctionJs.getRandomInt(pokemonSelected.length))];
    return pokemonDoSpawn
 }

 /**
  * resort un objet "pokemon" aléatoire
  */

function pokemonSelect(){
    
    let randomTypePokemon = typeIntToStr(fonctionJs.getRandomInt(valeurMaxRandom));
    let randomGen = generationSelect()
    let randomType = typeSelect()
    let pokemonChoiced = {};
    while(pokemonChoiced["id"] === undefined){
        
        let randomTypePokemon = typeIntToStr(fonctionJs.getRandomInt(valeurMaxRandom));
        let randomGen = generationSelect()
        let randomType = typeSelect()
        pokemonChoiced = pokemonChoice(randomTypePokemon, randomGen, randomType)
    }

    return(pokemonChoiced)
}


function typeSelect(){
    randomNumber = (fonctionJs.getRandomInt(variableGlobal.nbType*100)+1)

    if(randomNumber <= variableGlobal.acier){
        return "Steel"
    }else if(randomNumber <= variableGlobal.dragon){
        return "Dragon"
    }else if(randomNumber <= variableGlobal.electrik){
        return "Electric"
    }else if(randomNumber <= variableGlobal.feu){
        return "Fire"
    }else if(randomNumber <= variableGlobal.insecte){
        return "Bug"
    }else if(randomNumber <= variableGlobal.plante){
        return "Grass"
    }else if(randomNumber <= variableGlobal.psy){
        return "Psychic"
    }else if(randomNumber <= variableGlobal.sol){
        return "Ground"
    }else if(randomNumber <= variableGlobal.tenebres){
        return "Dark"
    }else if(randomNumber <= variableGlobal.combat){
        return "Fighting"
    }else if(randomNumber <= variableGlobal.eau){
        return "Water"
    }else if(randomNumber <= variableGlobal.fee){
        return "Fairy"
    }else if(randomNumber <= variableGlobal.glace){
        return "Ice"
    }else if(randomNumber <= variableGlobal.normal){
        return "Normal"
    }else if(randomNumber <= variableGlobal.poison){
        return "Poison"
    }else if(randomNumber <= variableGlobal.roche){
        return "Rock"
    }else if(randomNumber <= variableGlobal.spectre){
        return "Ghost"
    }else if(randomNumber <= variableGlobal.vol){
        return "Flying"
    }else {
        console.log("erreur dans le choix de la génération")
        return 0;
    }


}

function generationSelect(){
    randomNumber = (fonctionJs.getRandomInt(variableGlobal.nbGeneration*100)+1)

    if(randomNumber <= variableGlobal.gen1){
        return 1
    }else if(randomNumber <= variableGlobal.gen2){
        return 2
    }else if(randomNumber <= variableGlobal.gen3){
        return 3
    }else if(randomNumber <= variableGlobal.gen4){
        return 4
    }else if(randomNumber <= variableGlobal.gen5){
        return 5
    }else if(randomNumber <= variableGlobal.gen6){
        return 6
    }else if(randomNumber <= variableGlobal.gen7){
        return 7
    }else if(randomNumber <= variableGlobal.gen8){
        return 8
    }else if(randomNumber <= variableGlobal.gen9){
        return 9
    }else {
        console.log("erreur dans le choix de la génération")
        return 0;
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
    
    let tauxShiny = variableGlobal.tauxMaxShiny;
    let saveServer = savePokemonServer.getSave(idServer);

    if(savePokemonServer.hasCharmChroma(idServer,message )){
        tauxShiny /= 2;
    }
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
