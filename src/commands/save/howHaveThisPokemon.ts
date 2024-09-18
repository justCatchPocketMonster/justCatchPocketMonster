import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "howmuch",
    "command": new SlashCommandBuilder()
    .setName("howmuch")
    .setNameLocalizations({
            'fr': "combien"
    })
    .setDescription(bddText.commandHowExplication.Eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandHowExplication.Fr[0]
    })
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(bddText.commandHowOptionNameStringNumber.Eng[0])
                    .setNameLocalizations({
                            'fr': bddText.commandHowOptionNameStringNumber.Fr[0]
                    })
                    .setDescription(bddText.commandHowOptionDescStringNumber.Eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.commandHowOptionDescStringNumber.Fr[0]
                    })
                    .setRequired(false)
    )
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(bddText.commandHowOptionNameStringPokemonName.Eng[0])
                    .setNameLocalizations({
                            'fr': bddText.commandHowOptionNameStringPokemonName.Fr[0]
                    })
                    .setDescription(bddText.commandHowOptionDescStringPokemonName.Eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.commandHowOptionDescStringPokemonName.Fr[0]
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