const variableGlobal = require("../parameters/variableGlobal")
//sert a la connexion sur discord
function connexion(Discord, Client){

    let token = "OTgyOTg4NzQwMjcwMTIwOTYw.GWOXi9.KU-C-7BKbgSeWcVKTZYfP7j3xec6_20XsMc_No";

    Client.on('ready', () => {
        console.log("Je suis fonctionnel")
    });

    Client.login(token);
    return
}

module.exports = { connexion};
