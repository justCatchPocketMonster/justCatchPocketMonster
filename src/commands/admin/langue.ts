import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {PermissionFlagsBits, Interaction } from "discord.js";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "lang-choose",
    "command": new SlashCommandBuilder()
    .setName(bddText.commandLangName.Eng[0])
    .setNameLocalizations({
            'fr': bddText.commandLangName.Fr[0]
    })
    .setDescription(bddText.commandLangExplication.Eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandLangExplication.Fr[0]
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(bddText.langNameOptionString.Eng[0])
                    .setNameLocalizations({
                            'fr': bddText.langNameOptionString.Fr[0]
                    })
                    .setDescription(bddText.langDescOptionString.Eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.langDescOptionString.Fr[0]
                    })
                    .addChoices(
                            {name: "English", value: "eng"},
                            {name: "Français", value: "fr"}
                    )
                    .setRequired(true)
            )
    .setDefaultMemberPermissions(0),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}