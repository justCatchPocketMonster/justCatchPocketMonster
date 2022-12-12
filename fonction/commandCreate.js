
const {SlashCommandBuilder, SlashCommandChannelOption, SlashCommandBooleanOption, SlashCommandStringOption} = require("@discordjs/builders");
const {PermissionFlagsBits } = require("discord.js");
const bddText = require("../bdd/languageText.json")

const spawnCommand = new SlashCommandBuilder()
        .setName("spawn")
        .setDescription(bddText.commandSpawnExplication.Eng[0])
        .setDescriptionLocalization('fr', bddText.commandSpawnExplication.Fr[0])
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption(
                new SlashCommandBooleanOption()
                        .setName("spawnnameoption1")
                        .setDescription("spawndescoption1")
                        .setRequired(true)
        )
        .addChannelOption(
                new SlashCommandChannelOption()
                        //.addChannelTypes("GuildText")
                        .setName("spawnnameoption2")
                        .setDescription("spawndescoption2")
                        .setRequired(false)
        )

const codeCommand = new SlashCommandBuilder()
        .setName("code")
        .setDescription("codeDesc")
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