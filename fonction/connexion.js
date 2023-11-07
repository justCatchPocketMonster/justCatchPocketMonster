const variableGlobal = require("../parameters/variableGlobal");
const catchError = require("./catchError");
require('dotenv').config();

class Connexion {
    static connect(Discord, Client) {
        try {
            let token = process.env.TOKEN;

            Client.on('ready', () => {
                console.log("Je suis fonctionnel");
            });

            Client.on('error', (error) => {
                console.error(error);
            });
/*
            Client.on("debug", (info) => {
                console.log(info);
            });
*/
            Client.login(token);
            return;
        } catch(e) {
            catchError.saveError(null, null, "connexion.js", "connexion", e);
            console.error(e);
        }
    }
}

module.exports = Connexion;
