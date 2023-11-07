const pokedexBDD = require("../bdd/pokedexSaveUser.json");
const variableGlobal = require("../parameters/variableGlobal")
var Discord = require('discord.js');
const pokeData = require("../bdd/pokemon.json");
const nbPokemon = pokeData[pokeData.length-1]["id"]
const fs = require("fs");
const catchError = require("./catchError")
const lockfile = require('lockfile');
const path = require('path');

class pokedexSaveUser {
        
    /**
     * Ajout +1 a l'index du pokemon dans la sauvegarde et créer la sauvegarde si elle n'existe pas et la met a jour si elle ne l'est pas
     * @param {int} idPokemon //id pour l'index
     * @param {string} idUser //id de l'user pour la bonne sauvegarde
     */
    static pokedex(idPokemon, idUser){
        
        try {
            if(pokedexBDD[idUser] === undefined){
                createSaveUser(idUser)
            }
            if(pokedexBDD[idUser][nbPokemon] === undefined){
                updateNumberPossibilitySave(idUser);
            }
            pokedexBDD[idUser][idPokemon]+=1;
            SaveBdd();
        } catch(error) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "pokedex", error)
            console.error(error)
        }
    }

    //créer une sauvegarde celon l'id de l'user
    static createSaveUser(idUserCreate){
        try {
            pokedexBDD[idUserCreate] = {}
            SaveBdd();
        } catch(error) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "createSaveUser", error)
            console.error(error)
        }
        
    }

    //ajoute de nouvelle possibility si des pokemons sont ajoutés dans la bdd
    static updateNumberPossibilitySave(idUserUpdate){
        try {
            for(let i = 1; i < nbPokemon; i++){
                if(pokedexBDD[idUserUpdate][i]=== undefined){
                    pokedexBDD[idUserUpdate][i] = 0;
                }
            }
            SaveBdd();
            
        } catch(error) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "updateNumberPossibilitySave", error)
            console.error(error)
        }
    }

    static getSave(idUser){
        try {
            if(pokedexBDD[idUser] === undefined){
                createSaveUser(idUser)
            }
            if(pokedexBDD[idUser][nbPokemon] === undefined){
                updateNumberPossibilitySave(idUser);
            }
            return pokedexBDD[idUser]
        } catch(error) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "getSave", error)
            console.error(error)
        }
    }


    static getNumberCapturePokemon(idUser, idPokemon){

        try {
            return getSave(idUser)[idPokemon]
        } catch(error) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "getNumberCapturePokemon", error)
            console.error(error)
        }
    }

    static getCountNational(idUser){
        try {
            countPokemon = 0;
            Object.keys(pokedexBDD[idUser]).forEach(key => {
                if(pokedexBDD[idUser][key] > 0 && key <= nbPokemon){
                    countPokemon ++;
                }
        
            });
            return(countPokemon)
        } catch(error) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "getCountNational", error)
            console.error(error)
        }
    }

    static getPercentageNational(idUser){
        try {
            return(Math.floor((100*getCountNational(idUser))/((nbPokemon))))
        } catch(error) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "getPercentageNational", error)
            console.error(error)
        }
    }

    static getCountMaxMin(idUser, max, min){
        try {
            countPokemon = 0;
            min++;
            Object.keys(pokedexBDD[idUser]).forEach(key => {
                if(pokedexBDD[idUser][key] > 0 && key <= max && key >= min){
                    countPokemon ++;
                }
        
            });
            return(countPokemon)
        } catch(error) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "getCountMaxMin", error)
            console.error(error)
        }
    }


    static getCountAllPokemon(idUser){
        try {
            countPokemon = 0;
        
            Object.keys(pokedexBDD[idUser]).forEach(key => {
            
                countPokemon += pokedexBDD[idUser][key];
        
            });
            return(countPokemon)
        } catch(error) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "getCountAllPokemon", error)
            console.error(error)
        }
    }

    static getAllPokemonWithZeroCapture(idUser){
        try {
            array = [];
        
            Object.keys(pokedexBDD[idUser]).forEach(key => {
                if(pokedexBDD[idUser][key] <= 0 && key < nbPokemon){
                    array.push(key)
                }
        
            });
            return array
        } catch(error) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "getAllPokemonWithZeroCapture", error)
            console.error(error)
        }
    }


    static getPercentageMaxMin(idUser, max, min){
        try {
            return(Math.floor((100*getCountMaxMin(idUser, max, min))/(max-min)))
        } catch(error) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "getPercentageMaxMin", error)
            console.error(error)
        }
    }

    static SaveBdd(){

        const lockfilePath = path.join(__dirname,"..", 'lock', 'pokedexSaveUser.lock');

        

        try{
            lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
                if (err) {
                    console.error('Erreur lors du verrouillage du fichier :', err);
                    return;
                }
            fs.writeFile(path.join(__dirname,"..", 'bdd', 'pokedexSaveUser.json'), JSON.stringify(pokedexBDD, null, 4), (err)=> {
                if (err)console.log("erreur")

                lockfile.unlock(lockfilePath, (err) => {
                    if (err) {
                        console.error('Erreur lors du déverrouillage du fichier :', err);
                    }
                });
            });
        });
        } catch(e) {

            catchError.saveError(null, null, "pokedexSaveUser.js", "SaveBdd", e)
            console.error(e)
        }

    }
}

module.exports= pokedexSaveUser