import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"

export default {
    "name": "howmuch",
    "command": new SlashCommandBuilder()
    .setName("howmuch")
    .setNameLocalizations({
            'fr': "combien"
    })
    .setDescription(bddText.commandHowExplication.eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandHowExplication.fr[0]
    })
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(bddText.commandHowOptionNameStringNumber.eng[0])
                    .setNameLocalizations({
                            'fr': bddText.commandHowOptionNameStringNumber.fr[0]
                    })
                    .setDescription(bddText.commandHowOptionDescStringNumber.eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.commandHowOptionDescStringNumber.fr[0]
                    })
                    .setRequired(false)
    )
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(bddText.commandHowOptionNameStringPokemonName.eng[0])
                    .setNameLocalizations({
                            'fr': bddText.commandHowOptionNameStringPokemonName.fr[0]
                    })
                    .setDescription(bddText.commandHowOptionDescStringPokemonName.eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.commandHowOptionDescStringPokemonName.fr[0]
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