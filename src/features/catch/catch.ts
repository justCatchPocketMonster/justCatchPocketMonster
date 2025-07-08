import {UserType} from "../../core/types/UserType";
import {ServerType} from "../../core/types/ServerType";
import {ChatInputCommandInteraction, GuildMember} from "discord.js";
import {eventShinyAfterCatch} from "../event/eventShinyAfterCatch";
import language from "../../lang/language";


export function catchPokemon(user: UserType, server: ServerType, idChannel: string, pokemonInput:string, interaction: ChatInputCommandInteraction) {

    const pokemon = server.getPokemonById(idChannel);

    let name = "";
    const member = interaction.member as GuildMember;

    if(member.nickname != null){
        name = member.nickname
    } else {
        name = member.displayName;
    }

    if(pokemon == null){
        interaction.reply(language("noPokemonDisponible",server.language))
        return
    }
    if(!pokemon.nameIsSame(pokemonInput)){
        interaction.reply(language("failCatchGoodPokemonPart1",server.language)+" "+ name +""+ language("failCatchGoodPokemonPart2",server.language)+" "+ optionString+".")
        return
    }

    user.savePokemon.addOneCatch(pokemon)
    server.savePokemon.addOneCatch(pokemon)

            const shinyAfterEvent = eventShinyAfterCatch(interaction, pokemon.isShiny!, server);



    const nameFr = pokemon.name.nameFr[0];
    const nameEng = pokemon.name.nameEng[0];

    let messageCongratSend =
        language("congratYouCatchPart1",server.language) +
        name +
        language("congratYouCatchPart2",server.language) +
        (nameFr !== nameEng ? `${nameFr}/${nameEng}` : nameFr);

    if (pokemon.form === "mega") {
        messageCongratSend += " <:MEGA:1139228792989155359>";
    }

    messageCongratSend += shinyAfterEvent ? ":star:. " : ". ";

    const isFirstCapture =
        savePokemonUser.getNumberCapturePokemon(interaction.member.id, realPokemon.id) === 1;

    if (isFirstCapture) {
        messageCongratSend += language("newAtPokedex",server.language);
    }

    interaction.reply(messageCongratSend);


            spawnCount.setPokemonPresent(idServer,null, idChannel);
            return

}