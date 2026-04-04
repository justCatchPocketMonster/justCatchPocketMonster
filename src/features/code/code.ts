export { activeCode } from "./activeCode";
export { codeType } from "./codeType";
import { eventCode, landings } from "../../config/default/code";
import { version } from "../../config/default/misc";
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
export function updateArrayCode(generalStat: StatType, versionStat: StatType) {
  const next: Record<string, string[]> = {};

  for (const [k, v] of Object.entries(eventCode)) {
    next[k] = Array.from(new Set(v));
  }

  let palierGeneralSpawn: number | null = null;
  let palierGeneralCatch: number | null = null;
  let palierVersionSpawn: number | null = null;
  let palierVersionCatch: number | null = null;

  for (const landing of landings) {
    if (generalStat.pokemonSpawned >= landing) palierGeneralSpawn = landing;
    if (generalStat.pokemonCaught >= landing) palierGeneralCatch = landing;
    if (versionStat.pokemonSpawned >= landing) palierVersionSpawn = landing;
    if (versionStat.pokemonCaught >= landing) palierVersionCatch = landing;
  }

  next.shiny ??= [];
  if (palierGeneralSpawn) next.shiny.push(`SPAWNS${palierGeneralSpawn}`);
  if (palierGeneralCatch) next.shiny.push(`CATCHS${palierGeneralCatch}`);
  if (palierVersionSpawn) next.shiny.push(`SPAWNS${palierVersionSpawn}v${version}`);
  if (palierVersionCatch) next.shiny.push(`CATCHS${palierVersionCatch}v${version}`);

  setCode(next);
}
export function codeListEmbed(
  user: UserType,
  server: ServerType,
  generalStat: StatType,
  versionStat: StatType,
) {
  updateArrayCode(generalStat, versionStat);
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
