const variableGlobal = require("../parameters/variableGlobal")
const catchError = require("./catchError")

class functionJs {
        
    /**
     * Permet de retourner une valeur aleatoire
     * @param max valeur max 
     * @returns le retour de la valeur aléatoire
     */
    static getRandomInt(max){

        try{

        return Math.floor(Math.random()* max)
        } catch(e) {

            catchError.saveError(null, null, "functionJs.js", "getRandomInt", e)
            console.error(e)
        }
    }

    /**
     * le type qui permet de resortir la couleur adéqua
     * @param type chaine de caractère avec le type
     * @returns la couleur
     */
    static colorByType(type){
        try{
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
        } catch(e) {

            catchError.saveError(null, null, "functionJs.js", "colorByType", e)
            console.error(e)
        }
    }


    /**
     * permet de retourner la date actuel
     * @returns la date
     */
    static actualDate(){
        try{
            var date = new Date();
            
            var jour = date.getDate();
            var mois = date.getMonth();
            var annee = date.getFullYear();


            return(annee+"-"+mois+"-"+jour)

        } catch(e) {

            catchError.saveError(null, null, "functionJs.js", "actualDate", e)
            console.error(e)
        }
        
        
    }

    static actualHour(){
        try{
            var date = new Date();
            
            var heure = date.getHours();
            var minute = date.getMinutes();
            var seconde = date.getSeconds();


            return(heure+":"+minute+":"+seconde)
        } catch(e) {

            catchError.saveError(null, null, "functionJs.js", "actualHour", e)
            console.error(e)
        }
    }

    static dateDiff(date1, date2){
        var diff = {}                           
        var tmp = date2 - date1;
    
        tmp = Math.floor(tmp/1000);             
        diff.sec = tmp % 60;                    
    
        tmp = Math.floor((tmp-diff.sec)/60);  
        diff.min = tmp % 60;                    
    
        tmp = Math.floor((tmp-diff.min)/60);    
        diff.hour = tmp % 24;                   
        
        tmp = Math.floor((tmp-diff.hour)/24);   
        diff.day = tmp;
        
        return diff;
    }
}
module.exports = functionJs