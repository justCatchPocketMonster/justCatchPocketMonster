import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {PermissionFlagsBits, ChatInputCommandInteraction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"
import { getServer, updateServer} from "../../cache/ServerCache"
import server from "../../models/Server";

export default {
    "name": bddText.commandLangName.eng[0],
    "command": new SlashCommandBuilder()
    .setName(bddText.commandLangName.eng[0])
    .setNameLocalizations({
            'fr': bddText.commandLangName.fr[0]
    })
    .setDescription(bddText.commandLangExplication.eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandLangExplication.fr[0]
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(bddText.langNameOptionString.eng[0])
                    .setNameLocalizations({
                            'fr': bddText.langNameOptionString.fr[0]
                    })
                    .setDescription(bddText.langDescOptionString.eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.langDescOptionString.fr[0]
                    })
                    .addChoices(
                            {name: "English", value: "eng"},
                            {name: "Français", value: "fr"}
                    )
                    .setRequired(true)
            )
    .setDefaultMemberPermissions(0),
    "actif": true,
    async execute(interaction: ChatInputCommandInteraction){
        try{
            let server = await getServer(interaction.guildId);

            server.language = interaction.options.getString(bddText.langNameOptionString.eng[0]).toLowerCase();

            await updateServer(server.id, server);
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}