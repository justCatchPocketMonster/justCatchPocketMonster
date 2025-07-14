import {ServerType} from "../../core/types/ServerType";
import {UserType} from "../../core/types/UserType";
import {StatType} from "../../core/types/StatType";
import {EmbedBuilder} from "discord.js";
import language from "../../lang/language";
import {SaveOnePokemon} from "../../core/classes/SaveOnePokemon";
import {colorByType} from "../../utils/helperFunction";
import {pageType} from "../other/paginationButton";


export function howMuchThisPokemon(user: UserType, server: ServerType, stat:StatType, pokemonId: string){
    const saveOnePokemonUser = user.savePokemon.getSavesById(pokemonId);
    const saveOnePokemonServer = server.savePokemon.getSavesById(pokemonId);
    const saveOnePokemonStatSpawn = stat.savePokemonSpawn.getSavesById(pokemonId);
    const saveOnePokemonStatCatch = stat.savePokemonCatch.getSavesById(pokemonId);

    saveOnePokemonStatSpawn.forEach(save => {

    })


}

function generateEmbedData(pokemon: pokemonData, server: ServerType, avatarUser: string, allSaveData: saveFieldData): pageType{

    const embed = new EmbedBuilder()
        .setTitle(pokemon["name"]['name'+server.language][0])
        .setImage("attachment://"+ pokemon.imgName + ".png")
        .setThumbnail(avatarUser)
        .addFields(
            { name: language("nombreDeCapture", server.language), value: allSaveData.saveGlobalUser.normalCount.toString() , inline: true},
            { name: language("nombreDeCaptureShiny", server.language), value: allSaveData.saveGlobalUser.shinyCount.toString() , inline: true},
            { name: language("nombreCaptureVariant", server.language), value: allSaveData.saveSpecifiqueFormUser.normalCount.toString() , inline: true},
            { name: language("nombreDeCaptureDuServer", server.language), value: allSaveData.saveServer.normalCount.toString() , inline: false},
            { name: language("nombreDeCaptureTotaly", server.language), value: allSaveData.saveStatCatch.normalCount.toString() , inline: false},
            { name: language("nombreDeCaptureShinyTotaly", server.language), value: allSaveData.saveStatCatch.shinyCount.toString() , inline: true},
            { name: language("nombreDeSpawnTotaly", server.language), value: allSaveData.saveStatSpawn.normalCount.toString() , inline: true},
            { name: language("nombreDeSpawnShinyTotaly", server.language), value: allSaveData.saveStatSpawn.shinyCount.toString() , inline: true}

        )
        .setColor(colorByType(pokemon.arrayType[Math.floor(Math.random() * pokemon.arrayType.length)]))

    let adressImage
    if(server.eventSpawn.nightMode){
        adressImage = "./src/image/pokeHomeShadow/"+JSON.parse(JSON.stringify(pokemon.imgName))+".png";
    } else {
        adressImage = "./src/image/pokeHome/"+JSON.parse(JSON.stringify(pokemon.imgName))+".png";
    }
    return {page: embed, imagePage: adressImage}

}

interface saveFieldData{
    saveGlobalUser: SaveOnePokemon,
    saveSpecifiqueFormUser: SaveOnePokemon,
    saveServer: SaveOnePokemon,
    saveStatSpawn: SaveOnePokemon,
    saveStatCatch: SaveOnePokemon,
}

interface pokemonData {
    id: number
    name: {
        [key: string]: string[];
    }
    arrayType: string[]
    rarity: string
    gen: number
    imgName: string
    form: string
    versionForm: number
}