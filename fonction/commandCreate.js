
const {SlashCommandBuilder, SlashCommandChannelOption, SlashCommandBooleanOption, SlashCommandStringOption} = require("@discordjs/builders");
const {PermissionFlagsBits, ChannelType } = require("discord.js");
const bddText = require("../bdd/languageText.json")

const spawnCommand = new SlashCommandBuilder()
        .setName("spawn")
        .setDescription(bddText.commandSpawnExplication.Eng[0])
        .setDescriptionLocalizations({
                'fr': bddText.commandSpawnExplication.Fr[0]
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption(
                new SlashCommandBooleanOption()
                        .setName(bddText.spawnNameOptionBool.Eng[0])
                        .setNameLocalizations({
                                'fr': bddText.spawnNameOptionBool.Fr[0]
                        })
                        .setDescription(bddText.spawnDescOptionBool.Eng[0])
                        .setDescriptionLocalizations({
                                'fr': bddText.spawnDescOptionBool.Fr[0]
                        })
                        .setRequired(true)
        )
        .addChannelOption(
                new SlashCommandChannelOption()
                        //.addChannelTypes("GuildText")
                        .setName(bddText.commandCodeExplication.Eng[0])
                        .setNameLocalizations({
                                'fr': bddText.spawnNameOptionChannel.Fr[0]
                        })
                        .setDescription(bddText.spawnDescOptionChannel.Eng[0])
                        .setDescriptionLocalizations({
                                'fr': bddText.spawnDescOptionChannel.Fr[0]
                        })
                        .addChannelTypes(ChannelType.GuildText)
                        
                        .setRequired(false)
                        
        )

const codeCommand = new SlashCommandBuilder()
        .setName("code")
        .setDescription("codeDesc")
        .setDescriptionLocalizations({
                'fr': bddText.spawnDescOptionChannel.Fr[0]
        })
        .addStringOption(
                new SlashCommandStringOption()
                        .setName("codecommandoptionname")
                        .setDescription("codecommandoptiondesc")
                        .setRequired(true)
        )
        
const langCommand = new SlashCommandBuilder()
        .setName("lang")
        .setDescription("langDesc")
        .addStringOption(
                new SlashCommandStringOption()
                        .setName("langcommandoptionname")
                        .setDescription("langcommandoptiondesc")
                        .addChoices(
                                {name: "English", value: "eng"},
                                {name: "Français", value: "fr"}
                        )
                        .setRequired(true)
)
const pokedexCommand = new SlashCommandBuilder()
        .setName("pokedex")
        .setDescription("pokedexDesc")
        .addStringOption(
                new SlashCommandStringOption()
                        .setName("pokedexcommandoptionname")
                        .setDescription("pokedexcommandoptiondesc")
                        .setRequired(true)
)


module.exports = {spawnCommand, codeCommand, langCommand, pokedexCommand}