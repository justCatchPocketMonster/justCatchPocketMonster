
const {SlashCommandBuilder} = require("@discordjs/builders");
const {Permissions} = require("discord.js");
module.exports = {
    commands = [
        new SlashCommandBuilder()
            .setName("spawn")
            .setDescription("bas c'est un test")
            .addStringOption(option => {
                option
                    .setName("utilisateur")
                    .setDescription("Utilisateur que vous souhaitez mentionner")
                    .setRequired(false)
            })
            .setDescriptionLocalization('de')
            .setDefaultMembersPermissions(Permissions.DEFAULT)
            
    ]
    
    return()
}