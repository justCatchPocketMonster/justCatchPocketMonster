import {UserType} from "../../core/types/UserType";
import {ServerType} from "../../core/types/ServerType";
import {ChatInputCommandInteraction, GuildMember} from "discord.js";
import {eventShinyAfterCatch} from "../event/eventShinyAfterCatch";
import language from "../../lang/language";
import {getStatById, updateStat} from "../../cache/StatCache";
import {version} from "../../config/default/misc";


export async function catchPokemon(user: UserType, server: ServerType, idChannel: string, pokemonInput:string, interaction: ChatInputCommandInteraction) {

    const pokemon = server.getPokemonByIdChannel(idChannel);

    let memberDisplayName = "";
    const member = interaction.member as GuildMember;

    if(member.nickname != null){
        memberDisplayName = member.nickname
    } else {
        memberDisplayName = member.displayName;
    }

    if(!pokemon){
        interaction.reply(language("noPokemonDisponible",server.language))
        return
    }
    if(!pokemon.nameIsSame(pokemonInput)){
        interaction.reply(language("failCatchGoodPokemonPart1",server.language)+" "+ memberDisplayName +""+ language("failCatchGoodPokemonPart2",server.language)+" "+ pokemonInput+".")
        return
    }



    const shinyAfterEvent = eventShinyAfterCatch(interaction, pokemon.isShiny ?? (() => { throw new Error("isShiny est undefined"); })(), server);
    pokemon.isShiny = shinyAfterEvent;

    const statVersion = await getStatById(version)
    const statAll = await getStatById("global")

    statVersion.addCatch(pokemon)
    statAll.addCatch(pokemon)

    updateStat(version, statVersion);
    updateStat("global", statAll);
    user.savePokemon.addOneCatch(pokemon)
    server.savePokemon.addOneCatch(pokemon)

    const nameFr = pokemon.name.nameFr[0];
    const nameEng = pokemon.name.nameEng[0];

    let messageCongratSend =
        language("congratYouCatchPart1",server.language) +
        memberDisplayName +
        language("congratYouCatchPart2",server.language) +
        (nameFr !== nameEng ? `${nameFr}/${nameEng}` : nameFr);

    if (pokemon.form === "mega") {
        messageCongratSend += " <:MEGA:1139228792989155359>";
    }

    messageCongratSend += shinyAfterEvent ? ":star:. " : ". ";

    const isFirstCapture = user.savePokemon.getCatchByOnlyId(pokemon.id) === 1;

    if (isFirstCapture) {
        messageCongratSend += language("newAtPokedex",server.language);
    }

    interaction.reply(messageCongratSend);

    server.removePokemonByIdChannel(idChannel);

}