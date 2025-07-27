import {activeCode} from "./activeCode";
import {codeType} from "./codeType";
import { eventCode, landings } from "../../config/default/code";
import { UserType } from "../../core/types/UserType";
import { ServerType } from "../../core/types/ServerType";
import { EmbedBuilder } from "discord.js";
import language from "../../lang/language";
import {StatType} from "../../core/types/StatType";
let code: { [key: string]: string[] } = {
  shiny: [],
};

export function getCode() {
  return code;
}

export function setCode(newCode: typeof code) {
  code = newCode;
}
export function updateArrayCode(stat : StatType) {
  let code = getCode();
  for (let key in eventCode) {
    code[key] = JSON.parse(JSON.stringify(eventCode[key]));
  }
  let palierChoiceSpawn = null;
  let palierChoiceCatch = null;
  landings.forEach((landing) => {
    if (stat.pokemonSpawned >= landing) {
      palierChoiceSpawn = landing;
    }
  });

  landings.forEach((landing) => {
    if (stat.pokemonCaught >= landing) {
      palierChoiceCatch = landing;
    }
  });

  if (palierChoiceSpawn) {
    code.shiny.push("SPAWNS" + palierChoiceSpawn);
  }
  if (palierChoiceCatch) {
    code.shiny.push("CATCHS" + palierChoiceCatch);
  }
  console.log(code);
  setCode(code);
}
export function codeListEmbed(user: UserType, server: ServerType, stat: StatType) {
  updateArrayCode(stat)
  const embed = new EmbedBuilder();
  embed.setTitle(language("codeListEmbedTitle", server.language));
  embed.setDescription(language("codeListEmbedDescription", server.language));

  for (const [key, value] of Object.entries(getCode())) {
    value.forEach((code) => {
      if (user.enteredCode.includes(code)) {
        embed.addFields({
          name: code,
          value: ":white_check_mark:",
          inline: true,
        });
      } else {
        embed.addFields({
          name: code,
          value: ":x:",
          inline: true,
        });
      }
    });
  }
  return embed;
}

export { activeCode, code, codeType };
