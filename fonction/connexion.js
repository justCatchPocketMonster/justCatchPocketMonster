const variableGlobal = require("../parameters/variableGlobal")
const catchError = require("./catchError")
//sert a la connexion sur discord
function connexion(Discord, Client){
    try{
        //vrai token
        //let token = "OTgyOTg4NzQwMjcwMTIwOTYw.GsOf84.dJivLtJpNT-ahlNLEBA887OUJ87yHW2MYa3uVk";

        //token de teste
        let token = "OTcyODk0MTg1MDM4NDI2MTEy.G6C0QA.nMNvYwt5CoF-H-z3ehOH6U8QuVKaIaLaTcHzq4";

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
