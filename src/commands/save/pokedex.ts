import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"

export default {
    "name": "pokedex",
    "command": new SlashCommandBuilder()
    .setName("pokedex")
    .setDescription(bddText.commandPokedexExplication.eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandPokedexExplication.fr[0]
    })
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(bddText.pokedexNameOptionStringPage.eng[0])
                    .setNameLocalizations({
                            'fr': bddText.pokedexNameOptionStringPage.fr[0]
                    })
                    .setDescription(bddText.pokedexDescOptionStringPage.eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.pokedexDescOptionStringPage.fr[0]
                    })
                    .setRequired(false)
    ),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}