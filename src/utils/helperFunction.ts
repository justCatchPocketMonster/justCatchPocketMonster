import { TextChannel } from "discord.js";
import logger from "../middlewares/error"


const colorByType = (type: string) : string =>{
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
            default:
                return "FFFFFF";
        }
    }

    export {colorByType};