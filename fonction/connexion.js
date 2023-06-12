const variableGlobal = require("../parameters/variableGlobal")
const catchError = require("./catchError")
//sert a la connexion sur discord
function connexion(Discord, Client){
    try{
        //vrai token
        //let token = "OTgyOTg4NzQwMjcwMTIwOTYw.GsOf84.dJivLtJpNT-ahlNLEBA887OUJ87yHW2MYa3uVk";

        //token de teste
        let token = "OTgyOTg4NzQwMjcwMTIwOTYw.Gn1BcS.HMQSU15r2Li4enG82YKQ6K91fEaYPAh_8UTYvM";

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
