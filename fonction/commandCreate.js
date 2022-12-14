
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
                        .setName(bddText.spawnNameOptionChannel.Eng[0])
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
        .setDescription(bddText.commandCodeExplication.Eng[0])
        .setDescriptionLocalizations({
                'fr': bddText.commandCodeExplication.Fr[0]
        })
        .addStringOption(
                new SlashCommandStringOption()
                        .setName(bddText.codeNameOptionString.Eng[0])
                        .setNameLocalizations({
                                'fr': bddText.codeNameOptionString.Fr[0]
                        })
                        .setDescription(bddText.codeDescOptionString.Eng[0])
                        .setDescriptionLocalizations({
                                'fr': bddText.codeDescOptionString.Fr[0]
                        })
                        .setRequired(true)
        )
        
const langCommand = new SlashCommandBuilder()
        .setName(bddText.commandLangName.Eng[0])
        .setNameLocalizations({
                'fr': bddText.commandLangName.Fr[0]
        })
        .setDescription(bddText.commandLangExplication.Eng[0])
        .setDescriptionLocalizations({
                'fr': bddText.commandLangExplication.Fr[0]
        })
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


const pokedexCommand = new SlashCommandBuilder()
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
)


module.exports = {spawnCommand, codeCommand, langCommand, pokedexCommand}