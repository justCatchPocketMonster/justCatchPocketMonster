const variableGlobal = require("../parameters/variableGlobal")
//sert a la connexion sur discord
function connexion(Discord, Client){
    //vrai token
    let token = "OTgyOTg4NzQwMjcwMTIwOTYw.GWOXi9.KU-C-7BKbgSeWcVKTZYfP7j3xec6_20XsMc_No";

    //token de teste
    //let token = "OTcyODk0MTg1MDM4NDI2MTEy.GvHgE6.I84o58L0aeIu1TN3i_GYOeQN20Zq5Wz-uNiPW4";

    Client.on('ready', () => {
        console.log("Je suis fonctionnel")
    });

    Client.login(token);
    return
}

module.exports = { connexion};
