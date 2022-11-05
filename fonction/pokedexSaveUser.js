const pokedexBDD = require("../bdd/pokedexSaveUser.json");
const variableGlobal = require("../parameters/variableGlobal")
var Discord = require('discord.js');
const pokeData = require("../bdd/pokemon.json");
const nbPokemon = (pokeData.length);
const fs = require("fs");

/**
 * Ajout +1 a l'index du pokemon dans la sauvegarde et créer la sauvegarde si elle n'existe pas et la met a jour si elle ne l'est pas
 * @param {int} idPokemon //id pour l'index
 * @param {string} idUser //id de l'user pour la bonne sauvegarde
 */
function pokedex(idPokemon, idUser){
    if(pokedexBDD[idUser] === undefined){
        createSaveUser(idUser)
    }
    if(pokedexBDD[idUser][nbPokemon] === undefined){
        updateNumberPossibilitySave(idUser);
    }
    pokedexBDD[idUser][idPokemon]+=1;
    SaveBdd();
}

//créer une savuegarde celon l'id de l'user
function createSaveUser(idUserCreate){
    pokedexBDD[idUserCreate] = {}
    SaveBdd();
    
}

//ajoute de nouvelle possibility si des pokemons sont ajoutés dans la bdd
function updateNumberPossibilitySave(idUserUpdate){
    for(let i = 1; i < nbPokemon; i++){
        if(pokedexBDD[idUserUpdate][i]=== undefined){
            pokedexBDD[idUserUpdate][i] = 0;
        }
    }
    SaveBdd();
    
}

function getSave(idUser){
    if(pokedexBDD[idUser] === undefined){
        createSaveUser(idUser)
    }
    if(pokedexBDD[idUser][nbPokemon] === undefined){
        updateNumberPossibilitySave(idUser);
    }
    return pokedexBDD[idUser]
}


function getNumberCapturePokemon(idUser, idPokemon){
    return pokedexBDD[idUser][idPokemon]
}

function getCountNational(idUser){
    countPokemon = 0;
    Object.keys(pokedexBDD[idUser]).forEach(key => {
        if(pokedexBDD[idUser][key] > 0){
            countPokemon ++;
        }

    });
    return(countPokemon)
}

function getPercentageNational(idUser){
    return(Math.floor((100*getCountNational(idUser))/((pokeData.length)-1)))
}

function getCountMaxMin(idUser, max, min){
    countPokemon = 0;
    min++;
    Object.keys(pokedexBDD[idUser]).forEach(key => {
        if(pokedexBDD[idUser][key] > 0 && key <= max && key >= min){
            countPokemon ++;
        }

    });
    return(countPokemon)
}


function getCountAllPokemon(idUser){
    countPokemon = 0;

    Object.keys(pokedexBDD[idUser]).forEach(key => {
       
        countPokemon += pokedexBDD[idUser][key];

    });
    return(countPokemon)
}

function getAllPokemonWithZeroCapture(idUser){
    array = [];

    Object.keys(pokedexBDD[idUser]).forEach(key => {
        if(pokedexBDD[idUser][key] <= 0){
            array.push(key)
        }

    });
    return array
}


function getPercentageMaxMin(idUser, max, min){
    return(Math.floor((100*getCountMaxMin(idUser, max, min))/(max-min)))
}

function SaveBdd(){
    fs.writeFile("./bdd/pokedexSaveUser.json", JSON.stringify(pokedexBDD, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}

module.exports= {getNumberCapturePokemon, pokedex, getSave, createSaveUser, updateNumberPossibilitySave, getCountNational, getPercentageNational, getCountMaxMin,getPercentageMaxMin, getAllPokemonWithZeroCapture, getCountAllPokemon}