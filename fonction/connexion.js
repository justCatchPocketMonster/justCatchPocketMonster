const catchError = require("./catchError")
//sert a la connexion sur discord
function connexion(Discord, Client){

    try{
        //vrai token
        //let token = "";

        //token de teste
        let token = "OTcyODk0MTg1MDM4NDI2MTEy.G16x6C.sUiRrKCrJ7UVlnsDzqtYzZqsf87B5T826oSu-c";

        Client.on('ready', () => {
            console.log("Je suis fonctionnel")
        });

        Client.login(token);
        return
    } catch(e) {

        catchError.saveError(null, null, "connexion.js", "connexion", e)
        console.error(e)
    }
}

module.exports = { connexion};
