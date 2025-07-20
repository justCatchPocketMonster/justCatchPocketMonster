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

interface pokemonData {
  id: number;
  name: {
    [key: string]: string[];
  };
  arrayType: string[];
  rarity: string;
  gen: number;
  imgName: string;
  form: string;
  versionForm: number;
}
interface oneFieldEmbed {
  name: string;
  value: string;
  inline: boolean;
}

function pokedex(
  interaction: ChatInputCommandInteraction,
  user: UserType,
  server: ServerType,
  pageChoice: number,
) {
  const maxPokemonParPage = 21;
  var listPokemon = [];
  var arrayEmbed = [];


  let pageSelectedDefault;

  let pokeSave;
  let nbPage = 1;
  let nbPageMax = 2;
  nbPageMax += Math.trunc(allPokemon.length/21) +1;

  if (isNaN(Number(pageChoice))) {
    interaction.reply(language("ilFautUnNombre", server.language));
    pageSelectedDefault = 1;
  } else if (pageChoice > nbPageMax) {
    interaction.reply(language("valeurTropHaute", server.language));
    pageSelectedDefault = 1;
  } else {
    pageSelectedDefault = pageChoice;
  }

  const avatar = interaction.user.avatar
    ? interaction.user.avatar
    : "https://cdn.discordapp.com/embed/avatars/0.png";

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
          (100 * allPokemon[allPokemon.length - 1].id) /
            user.savePokemon.countUniquePokemonsCaught() +
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
          (100 * allPokemon[allPokemon.length - 1].id) /
            user.savePokemon.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      },
      {
        name: language("nationalDexServer", server.language),
        value:
          server.savePokemon.countUniquePokemonsShinyCaught() +
          "/" +
          allPokemon[allPokemon.length - 1]["id"] +
          " - " +
          (100 * allPokemon[allPokemon.length - 1].id) /
            server.savePokemon.countUniquePokemonsShinyCaught() +
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
  for (let y = 0; y <= (allPokemon[allPokemon.length-1].id+maxPokemonParPage); y++) {

    const pokeSave = buildPokedexEmbed(interaction, user, server);
    const start = 1 + maxPokemonParPage * (nbPage - 2);
    const end = maxPokemonParPage * (nbPage - 1);

    for (let i = start; i <= end; i++) {
      const pokemonData: pokemonData|undefined = allPokemon.find((pokemon) => pokemon.id === i,);
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
  paginationButton(interaction, arrayEmbed);
}


function buildPokemonField(pokemonData: pokemonData, user: UserType, server: ServerType, interaction: ChatInputCommandInteraction) {
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
    name: `${pokemonData.id} ${savePokemon.normalCount > 0 ? pokemonData.name["name"+server.language] : "?????"}  ${emote}`,
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

  const avatar = interaction.user.avatar
      ? interaction.user.avatar
      : "https://cdn.discordapp.com/embed/avatars/0.png";

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
                (100 * allPokemon[allPokemon.length - 1].id) /
                user.savePokemon.countUniquePokemonsCaught() +
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
                (100 * allPokemon[allPokemon.length - 1].id) /
                user.savePokemon.countUniquePokemonsShinyCaught() +
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
  let field: oneFieldEmbed[] = [];
  let valueMax = 151;
  let valueMin = 0;
  let saveUserWithIdRange = user.savePokemon.getThisSaveUniqueIdWithByIdRange(
    valueMin + 1,
    valueMax,
  );
  if (saveUserWithIdRange.countUniquePokemonsCaught() == valueMax - valueMin) {
    if (
      saveUserWithIdRange.countUniquePokemonsShinyCaught() ==
      valueMax - valueMin
    ) {
      field.push({
        name:
          "<:pokeballShinyStar:1005992732541603960> " +
          language("shinyDex", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    } else {
      field.push({
        name:
          "<:pokeballLight:981974905568522331> " +
          language("shinydexDeKanto", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    }
  } else {
    field.push({
      name:
        "<:pokeballDark:981974919212572682> " +
        language("pokedexDeKanto", server.language),
      value:
        saveUserWithIdRange.countUniquePokemonsCaught() +
        "/ " +
        (valueMax - valueMin) +
        " - " +
        (100 * (valueMax - valueMin)) /
          saveUserWithIdRange.countUniquePokemonsCaught() +
        "%",
      inline: true,
    });
  }

  valueMax = 251;
  valueMin = 151;
  saveUserWithIdRange = user.savePokemon.getThisSaveUniqueIdWithByIdRange(
    valueMin + 1,
    valueMax,
  );
  if (saveUserWithIdRange.countUniquePokemonsCaught() == valueMax - valueMin) {
    if (
      saveUserWithIdRange.countUniquePokemonsShinyCaught() ==
      valueMax - valueMin
    ) {
      field.push({
        name:
          "<:pokeballShinyStar:1005992732541603960> " +
          language("shinydexDeJohto", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    } else {
      field.push({
        name:
          "<:pokeballLight:981974905568522331> " +
          language("shinydexDeJohto", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    }
  } else {
    field.push({
      name:
        "<:pokeballDark:981974919212572682> " +
        language("pokedexDeJohto", server.language),
      value:
        saveUserWithIdRange.countUniquePokemonsCaught() +
        "/ " +
        (valueMax - valueMin) +
        " - " +
        (100 * (valueMax - valueMin)) /
          saveUserWithIdRange.countUniquePokemonsCaught() +
        "%",
      inline: true,
    });
  }

  valueMax = 386;
  valueMin = 251;
  saveUserWithIdRange = user.savePokemon.getThisSaveUniqueIdWithByIdRange(
    valueMin + 1,
    valueMax,
  );
  if (saveUserWithIdRange.countUniquePokemonsCaught() == valueMax - valueMin) {
    if (
      saveUserWithIdRange.countUniquePokemonsShinyCaught() ==
      valueMax - valueMin
    ) {
      field.push({
        name:
          "<:pokeballShinyStar:1005992732541603960> " +
          language("shinydexDeHoenn", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    } else {
      field.push({
        name:
          "<:pokeballLight:981974905568522331> " +
          language("shinydexDeHoenn", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    }
  } else {
    field.push({
      name:
        "<:pokeballDark:981974919212572682> " +
        language("pokedexDeHoenn", server.language),
      value:
        saveUserWithIdRange.countUniquePokemonsCaught() +
        "/ " +
        (valueMax - valueMin) +
        " - " +
        (100 * (valueMax - valueMin)) /
          saveUserWithIdRange.countUniquePokemonsCaught() +
        "%",
      inline: true,
    });
  }

  valueMax = 493;
  valueMin = 386;
  saveUserWithIdRange = user.savePokemon.getThisSaveUniqueIdWithByIdRange(
    valueMin + 1,
    valueMax,
  );
  if (saveUserWithIdRange.countUniquePokemonsCaught() == valueMax - valueMin) {
    if (
      saveUserWithIdRange.countUniquePokemonsShinyCaught() ==
      valueMax - valueMin
    ) {
      field.push({
        name:
          "<:pokeballShinyStar:1005992732541603960> " +
          language("shinydexDeSinnoh", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    } else {
      field.push({
        name:
          "<:pokeballLight:981974905568522331> " +
          language("shinydexDeSinnoh", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    }
  } else {
    field.push({
      name:
        "<:pokeballDark:981974919212572682> " +
        language("pokedexDeSinnoh", server.language),
      value:
        saveUserWithIdRange.countUniquePokemonsCaught() +
        "/ " +
        (valueMax - valueMin) +
        " - " +
        (100 * (valueMax - valueMin)) /
          saveUserWithIdRange.countUniquePokemonsCaught() +
        "%",
      inline: true,
    });
  }

  valueMax = 649;
  valueMin = 493;
  saveUserWithIdRange = user.savePokemon.getThisSaveUniqueIdWithByIdRange(
    valueMin + 1,
    valueMax,
  );
  if (saveUserWithIdRange.countUniquePokemonsCaught() == valueMax - valueMin) {
    if (
      saveUserWithIdRange.countUniquePokemonsShinyCaught() ==
      valueMax - valueMin
    ) {
      field.push({
        name:
          "<:pokeballShinyStar:1005992732541603960> " +
          language("shinydexDeUnys", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    } else {
      field.push({
        name:
          "<:pokeballLight:981974905568522331> " +
          language("shinydexDeUnys", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    }
  } else {
    field.push({
      name:
        "<:pokeballDark:981974919212572682> " +
        language("pokedexDeUnys", server.language),
      value:
        saveUserWithIdRange.countUniquePokemonsCaught() +
        "/ " +
        (valueMax - valueMin) +
        " - " +
        (100 * (valueMax - valueMin)) /
          saveUserWithIdRange.countUniquePokemonsCaught() +
        "%",
      inline: true,
    });
  }

  valueMax = 721;
  valueMin = 649;
  saveUserWithIdRange = user.savePokemon.getThisSaveUniqueIdWithByIdRange(
    valueMin + 1,
    valueMax,
  );
  if (saveUserWithIdRange.countUniquePokemonsCaught() == valueMax - valueMin) {
    if (
      saveUserWithIdRange.countUniquePokemonsShinyCaught() ==
      valueMax - valueMin
    ) {
      field.push({
        name:
          "<:pokeballShinyStar:1005992732541603960> " +
          language("shinydexDeKalos", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    } else {
      field.push({
        name:
          "<:pokeballLight:981974905568522331> " +
          language("shinydexDeKalos", server.language),
        value:
          saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "/ " +
          (valueMax - valueMin) +
          " - " +
          (100 * (valueMax - valueMin)) /
            saveUserWithIdRange.countUniquePokemonsShinyCaught() +
          "%",
        inline: true,
      });
    }
  } else {
    field.push({
      name:
        "<:pokeballDark:981974919212572682> " +
        language("pokedexDeKalos", server.language),
      value:
        saveUserWithIdRange.countUniquePokemonsCaught() +
        "/ " +
        (valueMax - valueMin) +
        " - " +
        (100 * (valueMax - valueMin)) /
          saveUserWithIdRange.countUniquePokemonsCaught() +
        "%",
      inline: true,
    });
  }

  return field;
}
