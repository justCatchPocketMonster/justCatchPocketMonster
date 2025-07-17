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

function pokedex(
  interaction: ChatInputCommandInteraction,
  user: UserType,
  server: ServerType,
  pageChoice: number,
) {
  const maxPokemonParPage = 21;
  var listPokemon = [];
  var arrayEmbed = [];
  const savePokemon = user.savePokemon.getThisSaveUniqueId();
  const emotePokeballDark = "<:pokeballDark:981974919212572682>";
  const emotePokeballLight = "<:pokeballLight:981974905568522331>";
  const emotePokeballShiny = "<:pokeballShinyStar:1005992732541603960>";
  const emoteMegaDark = "<:MegaVide:1141440546032853062> ";
  const emoteMega = "<:MEGA:1139228792989155359>";
  const emoteMegaShiny = "<:shinyMega:1141440293409923123>";
  let pageSelectedDefault;

  let pokeSave;
  let nbPage = 1;
  let nbPageMax = 1;
  while (
    pokemonObject.getNamePokemon(
      1 + maxPokemonParPage * nbPageMax,
      interaction.guild.id,
    ) !== null
  ) {
    nbPageMax++;
  }

  nbPageMax++;

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
    .addFields(generateFieldRegionStat(user, server))
    .addFields({ name: "\u200B", value: "\u200B", inline: false })
    .addFields(
      generateFiledRandomStat(interaction.member.id, interaction.guild.id),
    )
    .setFooter({ text: "Pages:  " + nbPage + "/" + nbPageMax + "." });

  arrayEmbed.push({ page: mainPage });

  nbPage++;
  while (
    pokemonObject.getNamePokemon(
      1 + maxPokemonParPage * (nbPage - 2),
      interaction.guild.id,
    ) !== null
  ) {
    pokeSave = new EmbedBuilder();

    for (
      let i = 1 + maxPokemonParPage * (nbPage - 2);
      i <= maxPokemonParPage * (nbPage - 1);
      i++
    ) {
      pokeFields = {};
      if (pokemonObject.getNamePokemon(i, interaction.guild.id) != null) {
        if (saveShiny[i] === 0) {
          if (savePokemon[i] === 0) {
            pokeFields = {
              name: i + " ?????  " + emotePokeballDark,
              value: language.getText(interaction.guild.id, "noCatch"),
              inline: true,
            };
          } else {
            pokeFields = {
              name:
                i +
                " " +
                pokemonObject.getNamePokemon(i, interaction.guild.id) +
                "  " +
                emotePokeballLight,
              value:
                language.getText(interaction.guild.id, "catched") +
                savePokemon[i],
              inline: true,
            };
          }
        } else {
          pokeFields = {
            name:
              i +
              " " +
              pokemonObject.getNamePokemon(i, interaction.guild.id) +
              "  " +
              emotePokeballShiny,
            value:
              language.getText(interaction.guild.id, "catched") +
              savePokemon[i],
            inline: true,
          };
        }

        saveMega = pokemonForm.getSaveByForm(interaction.member.id, "mega");
        if (saveMega.hasOwnProperty(i + "")) {
          if (saveMega[i]["normal"] === 0) {
            pokeFields.name += emoteMegaDark;
          } else {
            if (saveMega[i]["shiny"] === 0) {
              pokeFields.name += emoteMega;
            } else {
              pokeFields.name += emoteMegaShiny;
            }
          }
        }

        listPokemon.push(pokeFields);
      }
    }

    var sautLigne = [{ name: "\u200B", value: "\u200B" }];

    pokeSave
      .setThumbnail(interaction.member.avatarURL())
      .setColor("#0099FF")
      .setDescription("\u200B")
      .setTitle(
        language.getText(interaction.guild.id, "pokedexOf") +
          interaction.member.user.username,
      )
      .addFields(
        {
          name: language.getText(interaction.guild.id, "nationalDex"),
          value:
            savePokemonUser.getCountNational(interaction.member.id) +
            "/" +
            pokeDataAll[pokeDataAll.length - 1]["id"] +
            " - " +
            savePokemonUser.getPercentageNational(interaction.member.id) +
            "%",
          inline: true,
        },
        {
          name: language.getText(interaction.guild.id, "shinyDex"),
          value:
            saveShinyUser.getCountNational(interaction.member.id) +
            "/" +
            pokeDataAll[pokeDataAll.length - 1]["id"] +
            " - " +
            saveShinyUser.getPercentageNational(interaction.member.id) +
            "%",
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: false },
      )
      .addFields(listPokemon)
      .setFooter({ text: "Pages:  " + nbPage + "/" + nbPageMax + "." });

    listPokemon = [];
    nbPage++;
    arrayEmbed.push({ page: pokeSave });
  }

  paginationButton(interaction, arrayEmbed);
}

function generateFieldRegionStat(
  user: UserType,
  server: ServerType,
): RestOrArray<APIEmbedField> {
  let field: RestOrArray<APIEmbedField> = [];
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

function generateFiledRandomStat(idUser, idGuild) {
  try {
    field = [];

    listPokemonUncatch = savePokemonUser.getAllPokemonWithZeroCapture(idUser);
    listPokemonShinyUncatch =
      saveShinyUser.getAllPokemonWithZeroCapture(idUser);

    let pokemonRandomUncatch = pokeDataAll.find(
      (pokemon) =>
        pokemon.id ==
        listPokemonUncatch[fonction.getRandomInt(listPokemonUncatch.length)],
    );
    let pokemonShinyRandomUncatch = pokeDataAll.find(
      (pokemon) =>
        pokemon.id ==
        listPokemonShinyUncatch[
          fonction.getRandomInt(listPokemonShinyUncatch.length)
        ],
    );

    while (
      pokemonRandomUncatch === undefined &&
      listPokemonUncatch.length > 0
    ) {
      pokemonRandomUncatch = pokeDataAll.find(
        (pokemon) =>
          pokemon.id ==
          listPokemonUncatch[fonction.getRandomInt(listPokemonUncatch.length)],
      );
    }
    while (
      pokemonShinyRandomUncatch === undefined &&
      listPokemonShinyUncatch.length > 0
    ) {
      pokemonShinyRandomUncatch = pokeDataAll.find(
        (pokemon) =>
          pokemon.id ==
          listPokemonShinyUncatch[
            fonction.getRandomInt(listPokemonShinyUncatch.length)
          ],
      );
    }

    if (listPokemonUncatch.length <= 0) {
      field.push({
        name: language.getText(idGuild, "felicitation"),
        value: language.getText(idGuild, "vousLesAvezTous"),
        inline: true,
      });
    } else {
      field.push({
        name: language.getText(idGuild, "pokemonManquant"),
        value:
          pokemonRandomUncatch["name"]["name" + language.getLanguage(idGuild)],
        inline: true,
      });
    }

    if (listPokemonShinyUncatch.length <= 0) {
      field.push({
        name: language.getText(idGuild, "felicitation"),
        value: language.getText(idGuild, "vousLesAvezTous"),
        inline: true,
      });
    } else {
      field.push({
        name: language.getText(idGuild, "pokemonManquantShiny"),
        value:
          pokemonShinyRandomUncatch["name"][
            "name" + language.getLanguage(idGuild)
          ],
        inline: true,
      });
    }

    field.push({
      name: language.getText(idGuild, "nombreDeCapture"),
      value: "" + savePokemonUser.getCountAllPokemon(idUser),
      inline: true,
    });

    return field;
  } catch (error) {
    catchError.saveError(
      idGuild,
      null,
      "pokemonController.js",
      "generateFiledRandomStat",
      error,
    );
    console.error(error);
  }
}
