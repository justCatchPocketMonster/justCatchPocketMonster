const variableGlobal = require("../parameters/variableGlobal")
//sert a la connexion sur discord
function connexion(Discord, Client){

    let token = "OTcyODk0MTg1MDM4NDI2MTEy.GG-sRo.Z5kRXNLSujmDit1MIsqLoOtpWDWmVBlrlfKiQ4";

    Client.on('ready', () => {
        console.log("Je suis fonctionnel")
    });

    Client.login(token);
    return
}

module.exports = { connexion};
