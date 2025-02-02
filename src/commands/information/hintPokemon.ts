import {SlashCommandBuilder, SlashCommandChannelOption} from "@discordjs/builders";
import {ChannelType, ChatInputCommandInteraction, Interaction} from "discord.js";
import logger from "../../middlewares/error"
import language from "../../lang/language";
import {getServer} from "../../cache/ServerCache";
import createHint from "../../features/hint/createHint";

export default {
    "name": "hint",
    "command": new SlashCommandBuilder()
    .setName("hint")
    .setNameLocalizations({
            'fr': "indice"
    })
    .setDescription(language("commandHintExplication","eng"))
    .setDescriptionLocalizations({
            'fr': language("commandHintExplication","fr")
    })
    .addChannelOption(
            new SlashCommandChannelOption()
                    .setName("channel")
                    .setNameLocalizations({
                            'fr': "salon"
                    })
                    .setDescription(language("commandHintOptionDescChannel","eng"))
                    .setDescriptionLocalizations({
                            'fr': language("commandHintOptionDescChannel","fr")
                    })
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(false)
                    ),
    "actif": true,
    async execute(interaction: ChatInputCommandInteraction){
        try{
            if (!interaction.guildId) {
                return;
            }
            let server = await getServer(interaction.guildId);
            let channelOption = interaction.options.getChannel("channel");

            let channel = channelOption ? channelOption : interaction.channel;
            if (!channel) {
                return;
            }
            let hint: string | null = null;
            server.pokemonPresent.forEach(pokemon => {
                if (pokemon.idChannel == channel.id) {
                    //TODO: a finir
                    hint = createHint(pokemon.name);
                }
            })

            if(!hint){
                interaction.reply({content: language(interaction.guildId, "noHint"), ephemeral: true});
                return;
            }

            interaction.reply({content: language(interaction.guildId, "hintIs")+hint+" "+language(interaction.guildId, "forChannel")+channel.toString(), ephemeral: true});
        } catch (e) {
            logger.error(e)
        }
    }
}

