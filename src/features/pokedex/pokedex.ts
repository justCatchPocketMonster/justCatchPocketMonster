import { UserType } from "../../core/types/UserType";
import {
  APIEmbedField,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  RestOrArray,
} from "discord.js";
import { ServerType } from "../../core/types/ServerType";
import { paginationButton } from "../other/paginationButton";
import language from "../../lang/language";
import allPokemon from "../../data/pokemon.json";
import {pokemonDb} from "../../core/types/pokemonDb";
import {capitalizeFirstLetter, getPercentage} from "../../utils/helperFunction";

interface oneFieldEmbed {
  name: string;
  value: string;
  inline: boolean;
}

export function pokedex(
  interaction: ChatInputCommandInteraction,
  user: UserType,
  server: ServerType,
  pageChoice: number|null
) {
  const maxPokemonParPage = 21;
  var listPokemon = [];
  var arrayEmbed = [];
  if (pageChoice == null) {
    pageChoice = 1;
  }

  let pageSelectedDefault;

  let nbPage = 1;
  let nbPageMax = 2;
  nbPageMax += Math.trunc(allPokemon[allPokemon.length-1].id/21);

  if (isNaN(Number(pageChoice))) {
    interaction.reply(language("ilFautUnNombre", server.language));
    pageSelectedDefault = 1;
  } else if (pageChoice > nbPageMax) {
    interaction.reply(language("valeurTropHaute", server.language));
    pageSelectedDefault = 1;
  } else {
    pageSelectedDefault = pageChoice;
  }

  const avatar = interaction.user.avatarURL() ?? "https://cdn.discordapp.com/embed/avatars/0.png";

  let memberDisplayName = "";
  const member = interaction.member as GuildMember;

  if (member.nickname != null) {
    memberDisplayName = member.nickname;
  } else {
    memberDisplayName = member.displayName;
  }

  const mainPage = new EmbedBuilder()
    .setThumbnail(avatar)
    .setColor("#0099FF")
    .setDescription("\u200B")
    .setTitle(language("pokedexOf", server.language) + memberDisplayName)
    .addFields(
      {
        name: language("nationalDex", server.language),
        value:
          user.savePokemon.countUniquePokemonsCaught() +
          "/" +
          allPokemon[allPokemon.length - 1]["id"] +
          " - " +
          getPercentage(user.savePokemon.countUniquePokemonsCaught(), allPokemon[allPokemon.length - 1]["id"]) +
          "%",
        inline: true,
      },
      {
        name: language("shinyDex", server.language),
        value:
          user.savePokemon.countUniquePokemonsShinyCaught() +
          "/" +
          allPokemon[allPokemon.length - 1]["id"] +
          " - " +
            getPercentage(user.savePokemon.countUniquePokemonsShinyCaught(), allPokemon[allPokemon.length - 1]["id"]) +
          "%",
        inline: true,
      },
      {
        name: language("nationalDexServer", server.language),
        value:
          server.savePokemon.countUniquePokemonsCaught() +
          "/" +
          allPokemon[allPokemon.length - 1]["id"] +
          " - " +
            getPercentage(server.savePokemon.countUniquePokemonsCaught(), allPokemon[allPokemon.length - 1]["id"]) +
          "%",
        inline: true,
      },
      { name: "\u200B", value: "\u200B", inline: false },
    )
    .addFields(...generateFieldRegionStat(user, server))
    .addFields({ name: "\u200B", value: "\u200B", inline: false })
    .setFooter({ text: "Pages:  " + nbPage + "/" + nbPageMax + "." });

  arrayEmbed.push({ page: mainPage });
  nbPage++;
  for (let y = 0; y <= (allPokemon[allPokemon.length-1].id); y+=maxPokemonParPage) {

    const pokeSave = buildPokedexEmbed(interaction, user, server);
    const start = 1 + maxPokemonParPage * (nbPage - 2);
    const end = maxPokemonParPage * (nbPage - 1);

    for (let i = start; i <= end; i++) {
      const pokemonData: pokemonDb|undefined = allPokemon.find((pokemon) => pokemon.id === i,);
      if (!pokemonData) continue;

      const field = buildPokemonField(pokemonData,user, server, interaction);
      listPokemon.push(field);
    }

    pokeSave.addFields(listPokemon);
    pokeSave.setFooter({ text: "Pages: " + nbPage + "/" + nbPageMax + "." });

    listPokemon = [];
    nbPage++;
    arrayEmbed.push({ page: pokeSave });
  }

  paginationButton(interaction, arrayEmbed, pageSelectedDefault);

}


function buildPokemonField(pokemonData: pokemonDb, user: UserType, server: ServerType, interaction: ChatInputCommandInteraction) {
  const emotePokeballDark = "<:pokeballDark:981974919212572682>";
  const emotePokeballLight = "<:pokeballLight:981974905568522331>";
  const emotePokeballShiny = "<:pokeballShinyStar:1005992732541603960>";
  const emoteMegaDark = "<:MegaVide:1141440546032853062> ";
  const emoteMega = "<:MEGA:1139228792989155359>";
  const emoteMegaShiny = "<:shinyMega:1141440293409923123>";
  const savePokemon = user.savePokemon.getSaveOnePokemonFusedForm(pokemonData.id.toString());
  const allSavePokemonUser = user.savePokemon.getAllSaveOfOnePokemon(pokemonData.id.toString())


  let emote = emotePokeballDark;
  let value = language("noCatch", server.language);

  if (savePokemon.shinyCount > 0) {
    emote = emotePokeballShiny;
    value = language("catched", server.language) + savePokemon.shinyCount;
  } else if (savePokemon.normalCount > 0) {
    emote = emotePokeballLight;
    value = language("catched", server.language) + savePokemon.normalCount;
  }

  let field = {
    name: `${pokemonData.id} ${savePokemon.normalCount > 0 ? pokemonData.name["name"+capitalizeFirstLetter(server.language)] : "?????"}  ${emote}`,

    value: value,
    inline: true,
  };
/** TOTO: form after
  const saveMega = pokemonForm.getSaveByForm(interaction.member.id, "mega");
  if (saveMega.hasOwnProperty(index + "")) {
    const megaData = saveMega[index];
    if (megaData.normal === 0) {
      field.name += emoteMegaDark;
    } else if (megaData.shiny === 0) {
      field.name += emoteMega;
    } else {
      field.name += emoteMegaShiny;
    }

  }
 **/
  return field;
}

function buildPokedexEmbed(interaction: ChatInputCommandInteraction, user:UserType, server: ServerType) {

  const avatar = interaction.user.avatarURL() ?? "https://cdn.discordapp.com/embed/avatars/0.png";

  return new EmbedBuilder()
      .setThumbnail(avatar)
      .setColor("#0099FF")
      .setDescription("\u200B")
      .setTitle(
          language("pokedexOf", server.language) +
          interaction.user.username,
      )
      .addFields(
          {
            name: language("nationalDex", server.language),
            value:
                user.savePokemon.countUniquePokemonsCaught() +
                "/" +
                allPokemon[allPokemon.length - 1]["id"] +
                " - " +
                getPercentage(server.savePokemon.countUniquePokemonsCaught(), allPokemon[allPokemon.length - 1]["id"]) +
                "%",
            inline: true,
          },
          {
            name: language("shinyDex", server.language),
            value:
                user.savePokemon.countUniquePokemonsShinyCaught() +
                "/" +
                allPokemon[allPokemon.length - 1]["id"] +
                " - " +
                getPercentage(server.savePokemon.countUniquePokemonsShinyCaught(), allPokemon[allPokemon.length - 1]["id"]) +
                "%",
            inline: true,
          },
          { name: "\u200B", value: "\u200B", inline: false },
      );
}


function generateFieldRegionStat(
    user: UserType,
    server: ServerType,
): oneFieldEmbed[] {
  const regions = [
    { name: "Kanto", min: 0, max: 151 },
    { name: "Johto", min: 151, max: 251 },
    { name: "Hoenn", min: 251, max: 386 },
    { name: "Sinnoh", min: 386, max: 493 },
    { name: "Unys", min: 493, max: 649 },
    { name: "Kalos", min: 649, max: 721 },
  ];

  return regions.map(({ name, min, max }) =>
      processRegion(user, server, name, min, max)
  );
}

function processRegion(
    user: UserType,
    server: ServerType,
    regionName: string,
    valueMin: number,
    valueMax: number,
): oneFieldEmbed {
  const rangeSize = valueMax - valueMin;
  const save = user.savePokemon.getThisSaveUniqueIdWithByIdRange(valueMin + 1, valueMax);

  const caught = save.countUniquePokemonsCaught();
  const shiny = save.countUniquePokemonsShinyCaught();

  let name: string;
  let value: string;

  if (caught === rangeSize) {
    const shinyPercentage = getPercentage(shiny, rangeSize) + "%"; + "%";
    value = `${shiny}/ ${rangeSize} - ${shinyPercentage}`;

    if (shiny === rangeSize) {
      name = `<:pokeballShinyStar:1005992732541603960> ${language("shinyDex", server.language)}`;
    } else {
      name = `<:pokeballLight:981974905568522331> ${language("shinydexDe" + regionName, server.language)}`;
    }
  } else {
    const caughtPercentage = getPercentage(caught, rangeSize) + "%";
    name = `<:pokeballDark:981974919212572682> ${language("pokedexDe" + regionName, server.language)}`;
    value = `${caught}/ ${rangeSize} - ${caughtPercentage}`;
  }

  return {
    name,
    value,
    inline: true,
  };
}

