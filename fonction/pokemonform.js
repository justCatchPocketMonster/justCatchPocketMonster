const pokemonForm = require('../bdd/pokemonForm.json');
const pokeBdd = require('../bdd/pokemon.json');
const path = require('path');
const variableGlobal = require('../parameters/variableGlobal.js');

const form = variableGlobal.form;
const fs = require('fs');
const lockfile = require('lockfile');

function createSavePokemon(idUser){
    pokemonForm[idUser] = {}

    form.forEach(form => {
        pokemonForm[idUser][form] = {}
    })

    updateSavePokemon(idUser)
}

function updateSavePokemon(idUser){

    

    pokeBdd.forEach(pokemon => {
        form.forEach(form => {
            if(!pokemonForm[idUser].hasOwnProperty(form)){
                pokemonForm[idUser][form] = {}
            }
            if(pokemon.pokemonForm.hasOwnProperty(form)){
                if(!pokemonForm[idUser][form].hasOwnProperty(pokemon.id)){
                    
                    pokemonForm[idUser][form][pokemon.id] = {
                        "normal": 0,
                        "shiny": 0
                    }
                }
            }
        })
    
    })

    saveBdd();
}

function addPokemon(idUser, idPokemon, form, isShiny){
    if(!pokemonForm.hasOwnProperty(idUser)){
        createSavePokemon(idUser)
    }

    if(!pokemonForm[idUser][form].hasOwnProperty(idPokemon)){
        updateSavePokemon(idUser)
    }

    if(isShiny){
        pokemonForm[idUser][form][idPokemon].shiny++
    } else {
        pokemonForm[idUser][form][idPokemon].normal++
    }

    saveBdd();

}

function getSaveByForm(idUser, form){
    if(!pokemonForm.hasOwnProperty(idUser)){
        createSavePokemon(idUser)
    }

    if(!pokemonForm[idUser].hasOwnProperty(form)){
        updateSavePokemon(idUser)
    }

    return pokemonForm[idUser][form]
}


function saveBdd(){

    const lockfilePath = path.join(__dirname,"..", 'lock', 'pokemonForm.lock');

    try{
        lockfile.lock(lockfilePath, {"retries": 1000, "retryWait": 1000}, (err) => {
            if (err) {
                console.error('Erreur lors du verrouillage du fichier :', err);
                return;
            }
        fs.writeFile(path.join(__dirname,"..", 'bdd', 'pokemonForm.json'), JSON.stringify(pokemonForm, null, 4), (err)=> {
            if (err)console.log("erreur")

            lockfile.unlock(lockfilePath, (err) => {
                if (err) {
                    console.error('Erreur lors du déverrouillage du fichier :', err);
                }
            });
        });
    });
    } catch(e) {

        catchError.saveError(null, null, "eventStatChange.js", "SaveBdd", e)
        console.error(e)
    }
}

module.exports = {addPokemon, getSaveByForm}