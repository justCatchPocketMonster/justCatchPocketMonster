import { UserType } from "../../core/types/UserType";

function pokedex(user: UserType) {
  try {
    const maxPokemonParPage = 21;
    var listPokemon = [];
    var arrayEmbed = [];
    var savePokemon = savePokemonUser.getSave(interaction.member.id);
    var saveShiny = saveShinyUser.getSave(interaction.member.id);
    const emotePokeballDark = "<:pokeballDark:981974919212572682>";
    const emotePokeballLight = "<:pokeballLight:981974905568522331>";
    const emotePokeballShiny = "<:pokeballShinyStar:1005992732541603960>";
    const emoteMegaDark = "<:MegaVide:1141440546032853062> ";
    const emoteMega = "<:MEGA:1139228792989155359>";
    const emoteMegaShiny = "<:shinyMega:1141440293409923123>";
    var pageDeBase;

    if (savePokemon === undefined) {
      savePokemonUser.createSaveUser(interaction.member.id);
      savePokemonUser.updateNumberPossibilitySave(interaction.member.id);
      savePokemon = savePokemonUser.getSave(interaction.member.id);
    }
    let pokeSave;
    nbPage = 1;
    nbPageMax = 1;
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
      interaction.channel.send(
        language.getText(interaction.guild.id, "ilFautUnNombre"),
      );
      pageDeBase = 1;
    } else if (pageChoice > nbPageMax) {
      interaction.channel.send(
        language.getText(interaction.guild.id, "valeurTropHaute"),
      );
      pageDeBase = 1;
    } else {
      pageDeBase = pageChoice;
    }

    mainPage = new Discord.EmbedBuilder();
    mainPage
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
        {
          name: language.getText(interaction.guild.id, "nationalDexServer"),
          value:
            savePokemonServer.getCountNational(interaction.guild.id) +
            "/" +
            pokeDataAll[pokeDataAll.length - 1]["id"] +
            " - " +
            savePokemonServer.getPercentageNational(interaction.guild.id) +
            "%",
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: false },
      )
      .addFields(
        generateFieldRegionStat(interaction.member.id, interaction.guild.id),
      )
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
      pokeSave = new Discord.EmbedBuilder();

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

    pagination.paginationButton(interaction, arrayEmbed);
  } catch (error) {
    catchError.saveError(
      interaction.guild.id,
      interaction.channel.id,
      "pokemonController.js",
      "embedPokemonSaveUser",
      error,
    );
    console.error(error);
  }
}
