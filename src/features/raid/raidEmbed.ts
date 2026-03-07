import { ColorResolvable, EmbedBuilder } from "discord.js";
import { PokemonType } from "../../core/types/PokemonType";
import { ServerType } from "../../core/types/ServerType";
import getText from "../../lang/language";
import { colorByType, random } from "../../utils/helperFunction";
import { urlImageRepo } from "../../config/default/misc";

export function generateRaidEmbed(
  pokemon: PokemonType,
  server: ServerType,
  players: string[],
  endTimestamp: number,
): { embed: EmbedBuilder } {
  const suffix = pokemon.isShiny ? "-shiny.png" : ".png";
  const imageName = pokemon.imgName + suffix;
  const imageUrl = server.eventSpawn.nightMode
    ? urlImageRepo + "/pokeHomeShadow/" + imageName
    : urlImageRepo + "/pokeHome/" + imageName;

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

export function generateRaidEndEmbed(
  pokemon: PokemonType,
  server: ServerType,
  players: string[],
  success: boolean,
): EmbedBuilder {
  const suffix = pokemon.isShiny ? "-shiny.png" : ".png";
  const imageName = pokemon.imgName + suffix;
  const imageUrl = server.eventSpawn.nightMode
    ? urlImageRepo + "/pokeHomeShadow/" + imageName
    : urlImageRepo + "/pokeHome/" + imageName;

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
