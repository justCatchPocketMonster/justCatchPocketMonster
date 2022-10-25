const variableGlobal = require("../parameters/variableGlobal")
/**
 * Permet de retourner une valeur aleatoire
 * @param max valeur max 
 * @returns le retour de la valeur aléatoire
 */
function getRandomInt(max){
    return Math.floor(Math.random()* max)
}

/**
 * le type qui permet de resortir la couleur adéqua
 * @param type chaine de caractère avec le type
 * @returns la couleur
 */
function colorByType(type){
    switch (type) {
        case "Steel" :
            return "B7B7CE";
        case "Fighting" :
            return "C22E28";
        case "Dragon" :
            return "6F35FC";
        case "Water" :
            return "6390F0";
        case "Fire" :
            return "EE8130";
        case "Fairy" :
            return "D685AD";
        case "Ice" :
            return "96D9D6";
        case "Bug" :
            return "A6B91A";
        case "Normal" :
            return "A8A77A";
        case "Grass" :
            return "7AC74C";
        case "Poison" :
            return "A33EA1";
        case "Psychic" :
            return "F95587";
        case "Rock" :
            return "B6A136";
        case "Ground" :
            return "E2BF65";
        case "Ghost" :
            return "735797";
        case "Flying" :
            return "A98FF3";
        case "Electric" :
            return "F7D02C";
        case "Dark" :
            return "705746";

    }
}


/**
 * permet de retourner la date actuel
 * @returns la date
 */
function actualDate(){
    var date = new Date();
    
    var jour = date.getDate();
    var mois = date.getMonth();
    var annee = date.getFullYear();


    return(annee+"-"+mois+"-"+jour)
    
    
}

module.exports = {getRandomInt, colorByType, actualDate}