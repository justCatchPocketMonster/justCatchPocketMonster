const bddCatchError = require('../bdd/catchError.json')
const fs = require("fs")
const {Client} = require("discord.js")
const lockfile = require('lockfile');
const path = require('path');

class CatchError {

    static saveError(idServer, idChannel,fileName, functionName, error){
        let date = this.dateActuel()
        bddCatchError[date] = {
            "idServe": idServer,
            "idChannel": idChannel,
            "file": fileName, 
            "function": functionName, 
            "errorName": error.name,
            "errorMessage": error.message
            
        };

        this.SaveBdd();

    }

    static dateActuel(){
        var now = new Date();

        let date = now.getDate()+ "/"+ now.getMonth()+"/"+ now.getFullYear()+" - "+ now.getHours()+":"+ now.getMinutes()+":"+now.getSeconds() +" - "+ now.getMilliseconds();

        return(date)

    }


    static SaveBdd(){

        fs.writeFile(path.join(__dirname,"..", 'bdd', 'catchError.json'), JSON.stringify(bddCatchError, null, 4), (err)=> {
            if (err)console.log("erreur")
        });
        

    }

}

module.exports = CatchError
