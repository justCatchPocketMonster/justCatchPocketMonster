import { ServerType } from "../../core/types/ServerType";
import { UserType } from "../../core/types/UserType";
import { StatType } from "../../core/types/StatType";
import {AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import language from "../../lang/language";
import { SaveOnePokemon } from "../../core/classes/SaveOnePokemon";
import {capitalizeFirstLetter, colorByType} from "../../utils/helperFunction";
import { pageType, paginationButton } from "../other/paginationButton";
import allPokemon from "../../data/pokemon.json";
import {pokemonDb} from "../../core/types/pokemonDb";
import {urlImageRepo} from "../../config/default/misc";

export function howMuchThisPokemon(
  interaction: ChatInputCommandInteraction,
  user: UserType,
  server: ServerType,
  stat: StatType,
  pokemonId: string,
) {
  const saveOnePokemonUser = user.savePokemon.getSavesById(pokemonId);
  const saveOnePokemonServer = server.savePokemon.getSavesById(pokemonId);
  const saveOnePokemonStatSpawn = stat.savePokemonSpawn.getSavesById(pokemonId);
  const saveOnePokemonStatCatch = stat.savePokemonCatch.getSavesById(pokemonId);
  const paginationPage: pageType[] = [];
  const avatar= interaction.user.avatarURL() ?? "https://cdn.discordapp.com/embed/avatars/0.png";

  for (const save of saveOnePokemonStatSpawn) {
    const saveSpecifiqueFormUser = getSpecifiqueFormSaveData(
      save,
      saveOnePokemonUser,
    );
    if (saveSpecifiqueFormUser.versionForm === 0) {
      continue;
    }

    const saveField: SaveFieldData = {
      saveGlobalUser: getFusionSaveData(saveOnePokemonUser),
      saveSpecifiqueFormUser: saveSpecifiqueFormUser,
      saveServer: getSpecifiqueFormSaveData(save, saveOnePokemonServer),
      saveStatSpawn: save,
      saveStatCatch: getSpecifiqueFormSaveData(save, saveOnePokemonStatCatch),
    };

    const pokemonData = getPokemonDataBySave(save);
    if (pokemonData === null) return;


    if(saveSpecifiqueFormUser.normalCount > 0){
      paginationPage.push(
          generateEmbedData(pokemonData, server, avatar, saveField, false),
      );
      if (saveSpecifiqueFormUser.shinyCount > 0) {
        paginationPage.push(
            generateEmbedData(pokemonData, server, avatar, saveField, true),
        );
      }
    }
  }
  if(paginationPage.length === 0){
    const pokemonDataOriginal = getPokemonDataBySave(saveOnePokemonStatSpawn[0]);
    if (pokemonDataOriginal === null) return;
    pokemonDataOriginal.imgName = "0000-001";
    const saveField: SaveFieldData = {
      saveGlobalUser: getFusionSaveData(saveOnePokemonUser),
      saveSpecifiqueFormUser: saveOnePokemonStatSpawn[0],
      saveServer: getSpecifiqueFormSaveData(saveOnePokemonStatSpawn[0], saveOnePokemonServer),
      saveStatSpawn: saveOnePokemonStatSpawn[0],
      saveStatCatch: getSpecifiqueFormSaveData(saveOnePokemonStatSpawn[0], saveOnePokemonStatCatch),
    }
    paginationPage.push(
        generateEmbedData(pokemonDataOriginal, server, avatar, saveField, false),
    );
  }
  paginationButton(interaction, paginationPage);
}

function getSpecifiqueFormSaveData(
  exampleSave: SaveOnePokemon,
  saveList: SaveOnePokemon[],
): SaveOnePokemon {
  return (
    saveList.find(
      (save) =>
        save.idPokemon === exampleSave.idPokemon &&
        save.form === exampleSave.form &&
        save.versionForm === exampleSave.versionForm,
    ) ?? new SaveOnePokemon(exampleSave.idPokemon, "empty", "empty", 0, 0, 0)
  );
}

function getFusionSaveData(saveList: SaveOnePokemon[]): SaveOnePokemon {
  return saveList.reduce(
    (acc, save) => {
      acc.normalCount += save.normalCount;
      acc.shinyCount += save.shinyCount;
      return acc;
    },
    new SaveOnePokemon(saveList[0].idPokemon, "fusion", "fusion", 0, 0, 0),
  );
}

function getPokemonDataBySave(
  saveOnePokemon: SaveOnePokemon,
): pokemonDb | null {
  return (
    allPokemon.find(
      (pokemon) =>
        pokemon.id.toString() === saveOnePokemon.idPokemon &&
        pokemon.form === saveOnePokemon.form &&
        pokemon.versionForm === saveOnePokemon.versionForm,
    ) ?? null
  );
}

function generateEmbedData(
  pokemon: pokemonDb,
  server: ServerType,
  avatarUser: string,
  allSaveData: SaveFieldData,
  isShiny: boolean,
): pageType {
  const imageName = pokemon.imgName+(isShiny ? "-shiny" : "")+".png";
  const imageUrl = server.eventSpawn.nightMode
    ? urlImageRepo+"/pokeHomeShadow/"+imageName
    : urlImageRepo+"/pokeHome/"+imageName;

  const embed = new EmbedBuilder()
    .setTitle(pokemon["name"]["name" + capitalizeFirstLetter(server.language)][0])
    .setImage(imageUrl)
    .setThumbnail(avatarUser)
    .addFields(
      {
        name: language("nombreDeCapture", server.language),
        value: allSaveData.saveGlobalUser.normalCount.toString(),
        inline: true,
      },
      {
        name: language("nombreDeCaptureShiny", server.language),
        value: allSaveData.saveGlobalUser.shinyCount.toString(),
        inline: true,
      },
      {
        name: language("nombreCaptureVariant", server.language),
        value: allSaveData.saveSpecifiqueFormUser.normalCount.toString(),
        inline: true,
      },
      {
        name: language("nombreDeCaptureDuServer", server.language),
        value: allSaveData.saveServer.normalCount.toString(),
        inline: false,
      },
      {
        name: language("nombreDeCaptureTotaly", server.language),
        value: allSaveData.saveStatCatch.normalCount.toString(),
        inline: false,
      },
      {
        name: language("nombreDeCaptureShinyTotaly", server.language),
        value: allSaveData.saveStatCatch.shinyCount.toString(),
        inline: true,
      },
      {
        name: language("nombreDeSpawnTotaly", server.language),
        value: allSaveData.saveStatSpawn.normalCount.toString(),
        inline: true,
      },
      {
        name: language("nombreDeSpawnShinyTotaly", server.language),
        value: allSaveData.saveStatSpawn.shinyCount.toString(),
        inline: true,
      },
    )
    .setColor(
      colorByType(
        pokemon.arrayType[Math.floor(Math.random() * pokemon.arrayType.length)],
      ),
    );
  return { page: embed };
}

interface SaveFieldData {
  saveGlobalUser: SaveOnePokemon;
  saveSpecifiqueFormUser: SaveOnePokemon;
  saveServer: SaveOnePokemon;
  saveStatSpawn: SaveOnePokemon;
  saveStatCatch: SaveOnePokemon;
}

