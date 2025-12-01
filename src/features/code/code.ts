import { activeCode } from "./activeCode";
import { codeType } from "./codeType";
import { eventCode, landings } from "../../config/default/code";
import { UserType } from "../../core/types/UserType";
import { ServerType } from "../../core/types/ServerType";
import { EmbedBuilder } from "discord.js";
import language from "../../lang/language";
import { StatType } from "../../core/types/StatType";

const code: { [key: string]: string[] } = {
  shiny: [],
};

export function getCode() {
  return code;
}

export function setCode(newCode: Record<string, string[]>) {
  const snapshot: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(newCode)) {
    snapshot[k] = Array.from(v);
  }
  for (const k of Object.keys(code)) {
    delete code[k];
  }
  for (const [k, v] of Object.entries(snapshot)) {
    code[k] = v;
  }
}
export function updateArrayCode(stat: StatType) {
  const current = getCode();

  const next: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(current)) next[k] = [...v];

  for (const [k, v] of Object.entries(eventCode)) {
    const existing = next[k] ?? [];
    next[k] = Array.from(new Set([...existing, ...v]));
  }

  let palierChoiceSpawn: number | null = null;
  let palierChoiceCatch: number | null = null;

  for (const landing of landings) {
    if (stat.pokemonSpawned >= landing) palierChoiceSpawn = landing;
    if (stat.pokemonCaught >= landing) palierChoiceCatch = landing;
  }

  next.shiny ??= [];
  if (palierChoiceSpawn) next.shiny.push(`SPAWNS${palierChoiceSpawn}`);
  if (palierChoiceCatch) next.shiny.push(`CATCHS${palierChoiceCatch}`);

  setCode(next);
}
export function codeListEmbed(
  user: UserType,
  server: ServerType,
  stat: StatType,
) {
  updateArrayCode(stat);
  const embed = new EmbedBuilder();
  embed.setTitle(language("codeListEmbedTitle", server.settings.language));
  embed.setDescription(
    language("codeListEmbedDescription", server.settings.language),
  );

  for (const value of Object.values(getCode())) {
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

export { activeCode, codeType };
