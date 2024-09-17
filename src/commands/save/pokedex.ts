import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "pokedex",
    "command": new SlashCommandBuilder()
    .setName("pokedex")
    .setDescription(bddText.commandPokedexExplication.Eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandPokedexExplication.Fr[0]
    })
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(bddText.pokedexNameOptionStringPage.Eng[0])
                    .setNameLocalizations({
                            'fr': bddText.pokedexNameOptionStringPage.Fr[0]
                    })
                    .setDescription(bddText.pokedexDescOptionStringPage.Eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.pokedexDescOptionStringPage.Fr[0]
                    })
                    .setRequired(false)
    ),
    "actif": true,
    async execute(){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}