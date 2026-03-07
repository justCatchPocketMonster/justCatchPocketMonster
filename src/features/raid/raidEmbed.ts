import { ColorResolvable, EmbedBuilder } from "discord.js";
import { PokemonType } from "../../core/types/PokemonType";
import { ServerType } from "../../core/types/ServerType";
import getText from "../../lang/language";
import { colorByType, random } from "../../utils/helperFunction";
import { getImageUrl } from "../../utils/imageUrl";

export async function generateRaidEmbed(
  pokemon: PokemonType,
  server: ServerType,
  players: string[],
  endTimestamp: number,
): Promise<{ embed: EmbedBuilder }> {
  const suffix = pokemon.isShiny ? "-shiny.png" : ".png";
  const imageName = pokemon.imgName + suffix;
  const subFolder = server.eventSpawn.nightMode ? "pokeHomeShadow" : "pokeHome";
  const imageUrl = await getImageUrl(subFolder, imageName);

  const color: ColorResolvable = colorByType(
    pokemon.arrayType[random(pokemon.arrayType.length)],
  );

  const playerList =
    players.length > 0
      ? players.map((id) => `<@${id}>`).join("\n")
      : getText("raidNoPlayers", server.settings.language);

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(getText("raidEmbedTitle", server.settings.language))
    .setDescription(getText("raidEmbedDescription", server.settings.language))
    .setImage(imageUrl)
    .addFields(
      {
        name:
          getText("raidEmbedPlayers", server.settings.language) +
          ` (${players.length}/4)`,
        value: playerList,
        inline: true,
      },
      {
        name: getText("raidEmbedTimeRemaining", server.settings.language),
        value: `<t:${endTimestamp}:R>`,
        inline: true,
      },
    )
    .setFooter({
      text: getText("raidEmbedFooter", server.settings.language),
    });

  return { embed };
}

export async function generateRaidEndEmbed(
  pokemon: PokemonType,
  server: ServerType,
  players: string[],
  success: boolean,
): Promise<EmbedBuilder> {
  const suffix = pokemon.isShiny ? "-shiny.png" : ".png";
  const imageName = pokemon.imgName + suffix;
  const subFolder = server.eventSpawn.nightMode ? "pokeHomeShadow" : "pokeHome";
  const imageUrl = await getImageUrl(subFolder, imageName);

  const color: ColorResolvable = success
    ? (0x2ecc71 as ColorResolvable)
    : (0xe74c3c as ColorResolvable);

  const title = success
    ? getText("raidSuccess", server.settings.language)
    : getText("raidFail", server.settings.language);

  const playerList =
    players.length > 0
      ? players.map((id) => `<@${id}>`).join("\n")
      : getText("raidNoPlayers", server.settings.language);

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setImage(imageUrl)
    .addFields({
      name:
        getText("raidEndPlayers", server.settings.language) +
        ` (${players.length}/4)`,
      value: playerList,
      inline: false,
    });
}
