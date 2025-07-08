import {SlashCommandBuilder} from "@discordjs/builders";
import {ChatInputCommandInteraction, Interaction} from "discord.js";
import logger from "../../middlewares/error"
import language from "../../lang/language";

export default {
    "name": "tutorial",
    "command": new SlashCommandBuilder()
    .setName("tutorial")
    .setNameLocalizations({
            'fr': "tutoriel"
    })
    .setDescription(language("commandStatExplication","eng"))
    .setDescriptionLocalizations({
            'fr': language("commandHowIDoExplication","fr")
    }),
    "actif": true,
    async execute(interaction: ChatInputCommandInteraction){
        try{
            pages = []

            mainPage =
                pages.push(
                    pagination.createPageForMenu(
                        new Discord.EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle(language.getText(interaction.guild.id, "tutorialTitle"))
                            .setDescription(language.getText(interaction.guild.id, "tutorialDescription"))
                            .addFields(
                                {name: language.getText(interaction.guild.id, "tutorialField1Title"), value: language.getText(interaction.guild.id, "tutorialField1Desc"), inline: false},
                                {name: language.getText(interaction.guild.id, "tutorialField2Title"), value: language.getText(interaction.guild.id, "tutorialField2Desc"), inline: false},
                                {name: language.getText(interaction.guild.id, "tutorialField3Title"), value: language.getText(interaction.guild.id, "tutorialField3Desc"), inline: false},
                            )
                            .setImage("https://cdn.discordapp.com/attachments/1150766647905366086/1150767117206036510/botGifTuto.gif")
                        ,
                        null,
                        language.getText(interaction.guild.id, "baseTutorialTitle"),
                        ""
                    )
                )

            pages.push(
                pagination.createPageForMenu(
                    new Discord.EmbedBuilder()
                        .setColor('#7B68EE')
                        .setTitle(language.getText(interaction.guild.id, "tutorialAdminTitle"))
                        .setDescription(language.getText(interaction.guild.id, "tutorialAdminDescription"))
                        .addFields(
                            {name: language.getText(interaction.guild.id, "tutorialAdminField1Title"), value: language.getText(interaction.guild.id, "tutorialAdminField1Desc"), inline: false},
                            {name: language.getText(interaction.guild.id, "tutorialAdminField2Title"), value: language.getText(interaction.guild.id, "tutorialAdminField2Desc"), inline: false},
                        )
                    ,
                    null,
                    language.getText(interaction.guild.id, "tutorialAdminTitle"),
                    ""
                )
            )


            pagination.paginationMenu(interaction, language.getText(interaction.guild.id, "selectAPage"), pages)
        } catch (e) {
            logger.error(e)
        }
        
    }

}