const bddCatchError = require('../bdd/catchError.json')


function createServerError(idServer){
    if(bddCatchError[idServerCreate] === undefined){
        bddCatchError[idServerCreate] = {}
        SaveBdd();
    }
}

function saveError(idServer, error){
    if(bddCatchError[idServerCreate] === undefined){
        createServerError(idServer);
    }
    bddCatchError[idServerCreate][dateActuel] = error;
    SaveBdd();

}

function dateActuel(){
    var now = new Date();

    return(now.getDate+ "/"+ now.getMonth+"/"+ now.getFullYear+"-"+ now.getHours+":"+ now.getMinutes+":"+now.getSeconds)

}



function SaveBdd(){
    fs.writeFile("./bdd/catchError.json", JSON.stringify(bddCatchError, null, 4), (err)=> {
        if (err)console.log("erreur")
    })
}

module.exports = {saveError}