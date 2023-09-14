const bddCatchError = require('../bdd/catchError.json')
const fs = require("fs")
const {Client} = require("discord.js")
const lockfile = require('lockfile');
const path = require('path');


function saveError(idServer, idChannel,fileName, functionName, error){
    date = dateActuel()
    bddCatchError[date] = {
        "idServe": idServer,
        "idChannel": idChannel,
        "file": fileName, 
        "function": functionName, 
        "errorName": error.name,
        "errorMessage": error.message
        
    };

    SaveBdd();

}

function dateActuel(){
    var now = new Date();

    date = now.getDate()+ "/"+ now.getMonth()+"/"+ now.getFullYear()+" - "+ now.getHours()+":"+ now.getMinutes()+":"+now.getSeconds() +" - "+ now.getMilliseconds();

    return(date)

}


function SaveBdd(){

    fs.writeFile(path.join(__dirname,"..", 'bdd', 'catchError.json'), JSON.stringify(bddCatchError, null, 4), (err)=> {
        if (err)console.log("erreur")
    });
    

}

module.exports = {saveError}