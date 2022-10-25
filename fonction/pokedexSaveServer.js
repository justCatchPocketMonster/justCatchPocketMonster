const pokedexBDD = require("../bdd/pokedexSaveServer.json");
const charmeChroma = require("../bdd/charmeChroma.json")
const variableGlobal = require("../parameters/variableGlobal")
var Discord = require('discord.js');
const pokeData = require("../bdd/pokemon.json");
const nbPokemon = (pokeData.length);
const language = require("../fonction/language")
const fs = require("fs")

/**
 * Ajout +1 a l'index du pokemon dans la sauvegarde et créer la sauvegarde si elle n'existe pas et la met a jour si elle ne l'est pas
 * @param {int} idPokemon //id pour l'index
 * @param {string} idServer //id du Server pour la bonne sauvegarde
 */
function pokedex(idPokemon, idServer){
    if(pokedexBDD[idServer] === undefined){
        createSaveServer(idServer);
    }
    if(pokedexBDD[idServer][nbPokemon] === undefined){
        updateNumberPossibilitySave(idServer);
    }
    pokedexBDD[idServer][idPokemon]+=1;
    SaveBdd();
}

//créer une savuegarde celon l'id de l'Server
function createSaveServer(idServerCreate){
    if(pokedexBDD[idServerCreate] === undefined){
        pokedexBDD[idServerCreate] = {}
        SaveBdd();
    }
    
}

function hasCharmChroma(idServerCreate, message){
    if(pokedexBDD[idServerCreate] === undefined){
        createSaveServer(idServerCreate);
    }
    if(pokedexBDD[idServerCreate][nbPokemon] === undefined){
        updateNumberPossibilitySave(idServerCreate);
    }
    if(charmeChroma[idServerCreate] === undefined){
        charmeChroma[idServerCreate] = {}
        SaveBddCharmeChroma();
    }
    if(charmeChroma[idServerCreate]["charmeChroma"] === undefined){
        charmeChroma[idServerCreate]["charmeChroma"] = false
        SaveBddCharmeChroma();
    }

    for (const [key, value] of Object.entries(pokedexBDD[idServerCreate])) {

        if(value === 0){

            if(charmeChroma[idServerCreate]["charmeChroma"] === true){
                message.channel.send(language.getText(message.guild.id, "charmeChromaLose"))
                charmeChroma[idServerCreate]["charmeChroma"] = false
                SaveBddCharmeChroma();
            }
            return false
        }
    }
    if(charmeChroma[idServerCreate]["charmeChroma"] === false){
        message.channel.send(language.getText(message.guild.id, "charmeChromaWin"))
        charmeChroma[idServerCreate]["charmeChroma"] = true
        SaveBddCharmeChroma();
    }
    return true
}

function getSave(idServerCreate){
    if(pokedexBDD[idServerCreate] === undefined){
        createSaveServer(idServerCreate)
    }
    if(pokedexBDD[idServerCreate][nbPokemon] === undefined){
        updateNumberPossibilitySave(idServerCreate);
    }
    return pokedexBDD[idServerCreate]
}

//ajoute de nouvelle possibility si des pokemons sont ajoutés dans la bdd
function updateNumberPossibilitySave(idServerUpdate){
    for(let i = 1; i < nbPokemon; i++){
        if(pokedexBDD[idServerUpdate][i]=== undefined){
            pokedexBDD[idServerUpdate][i] = 0;
        }
    }
    SaveBdd();
    
}

function SaveBdd(){
    fs.writeFile("./bdd/pokedexSaveServer.json", JSON.stringify(pokedexBDD, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}
function SaveBddCharmeChroma(){
    fs.writeFile("./bdd/charmeChroma.json", JSON.stringify(charmeChroma, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}

module.exports= {hasCharmChroma, pokedex, createSaveServer, getSave}