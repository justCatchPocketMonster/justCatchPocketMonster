import { ServerType } from "../../core/types/ServerType";
import { UserType } from "../../core/types/UserType";
import { StatType } from "../../core/types/StatType";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import language from "../../lang/language";
import { SaveOnePokemon } from "../../core/classes/SaveOnePokemon";
import {
  capitalizeFirstLetter,
  colorByType,
  random,
} from "../../utils/helperFunction";
import {
  createPageForMenu,
  PageData,
  paginationMenu,
} from "../other/paginationMenu";
import allPokemon from "../../data/json/pokemon.json";
import { pokemonDb } from "../../core/types/pokemonDb";
import { getImageUrl } from "../../utils/imageUrl";

export async function howMuchThisPokemon(
  interaction: ChatInputCommandInteraction,
  user: UserType,
  server: ServerType,
  stat: StatType,
  pokemonId: string,
): Promise<void> {
  const saveOnePokemonUser = user.savePokemon.getSavesById(pokemonId);
  const saveOnePokemonServer = server.savePokemon.getSavesById(pokemonId);
  const saveOnePokemonStatSpawn = stat.savePokemonSpawn.getSavesById(pokemonId);
  const saveOnePokemonStatCatch = stat.savePokemonCatch.getSavesById(pokemonId);
  const paginationPage: PageData[] = [];
  const avatar =
    interaction.user.avatarURL() ??
    "https://cdn.discordapp.com/embed/avatars/0.png";

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

    if (saveSpecifiqueFormUser.normalCount > 0) {
      paginationPage.push(
        await generateEmbedData(pokemonData, server, avatar, saveField, false),
      );
      if (saveSpecifiqueFormUser.shinyCount > 0) {
        paginationPage.push(
          await generateEmbedData(pokemonData, server, avatar, saveField, true),
        );
      }
    }
  }
  if (paginationPage.length === 0) {
    const pokemonDataOriginal = getPokemonDataBySave(
      saveOnePokemonStatSpawn[0],
    );
    if (pokemonDataOriginal === null) return;
    pokemonDataOriginal.imgName = "0000-001";
    const saveField: SaveFieldData = {
      saveGlobalUser: getFusionSaveData(saveOnePokemonUser),
      saveSpecifiqueFormUser: saveOnePokemonStatSpawn[0],
      saveServer: getSpecifiqueFormSaveData(
        saveOnePokemonStatSpawn[0],
        saveOnePokemonServer,
      ),
      saveStatSpawn: saveOnePokemonStatSpawn[0],
      saveStatCatch: getSpecifiqueFormSaveData(
        saveOnePokemonStatSpawn[0],
        saveOnePokemonStatCatch,
      ),
    };
    paginationPage.push(
      await generateEmbedData(
        pokemonDataOriginal,
        server,
        avatar,
        saveField,
        false,
      ),
    );
  }

  const defaultText =
    server.settings.language === "fr"
      ? "Choisir une variante..."
      : "Select a variant...";
  paginationMenu(interaction, defaultText, paginationPage);
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

async function generateEmbedData(
  pokemon: pokemonDb,
  server: ServerType,
  avatarUser: string,
  allSaveData: SaveFieldData,
  isShiny: boolean,
): Promise<PageData> {
  const imageName = pokemon.imgName + (isShiny ? "-shiny" : "") + ".png";
  const subFolder = server.eventSpawn.nightMode ? "pokeHomeShadow" : "pokeHome";
  const imageUrl = await getImageUrl(subFolder, imageName);

  const completKey = ("nameComplet" +
    capitalizeFirstLetter(server.settings.language)) as
    | "nameCompletFr"
    | "nameCompletEng";

  const pokemonTitle = pokemon.name[completKey][0];
  const menuLabel = isShiny ? `${pokemonTitle} â­` : pokemonTitle;

  const embed = new EmbedBuilder()
    .setTitle(pokemonTitle)
    .setImage(imageUrl)
    .setThumbnail(avatarUser)
    .addFields(
      {
        name: language("nombreDeCapture", server.settings.language),
        value: allSaveData.saveGlobalUser.normalCount.toString(),
        inline: true,
      },
      {
        name: language("nombreDeCaptureShiny", server.settings.language),
        value: allSaveData.saveGlobalUser.shinyCount.toString(),
        inline: true,
      },
      {
        name: language("nombreCaptureVariant", server.settings.language),
        value: allSaveData.saveSpecifiqueFormUser.normalCount.toString(),
        inline: true,
      },
      {
        name: language("nombreDeCaptureDuServer", server.settings.language),
        value: allSaveData.saveServer.normalCount.toString(),
        inline: false,
      },
      {
        name: language("nombreDeCaptureTotaly", server.settings.language),
        value: allSaveData.saveStatCatch.normalCount.toString(),
        inline: false,
      },
      {
        name: language("nombreDeCaptureShinyTotaly", server.settings.language),
        value: allSaveData.saveStatCatch.shinyCount.toString(),
        inline: true,
      },
      {
        name: language("nombreDeSpawnTotaly", server.settings.language),
        value: allSaveData.saveStatSpawn.normalCount.toString(),
        inline: true,
      },
      {
        name: language("nombreDeSpawnShinyTotaly", server.settings.language),
        value: allSaveData.saveStatSpawn.shinyCount.toString(),
        inline: true,
      },
    )
    .setColor(colorByType(pokemon.arrayType[random(pokemon.arrayType.length)]));

  return createPageForMenu(embed, null, menuLabel);
}

interface SaveFieldData {
  saveGlobalUser: SaveOnePokemon;
  saveSpecifiqueFormUser: SaveOnePokemon;
  saveServer: SaveOnePokemon;
  saveStatSpawn: SaveOnePokemon;
  saveStatCatch: SaveOnePokemon;
}
