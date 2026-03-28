import { Client } from "discord.js";

import { newLogger } from "../middlewares/logger";
import randomStatus from "../features/other/randomStatus";

import langue from "../commands/admin/langue";
import spawn from "../commands/admin/spawn";
import adminSettings from "../commands/admin/adminSettings";
import hintPokemon from "../commands/information/hintPokemon";
import information from "../commands/information/information";
import stat from "../commands/information/stat";
import tutorial from "../commands/information/tutorial";
import howMuchThisPokemon from "../commands/save/howMuchThisPokemon";
import pokedex from "../commands/save/pokedex";
import effect from "../commands/server/effect";
import catchPokemon from "../commands/user/catchPokemon";
import code from "../commands/user/code";
import trade from "../commands/user/trade";

const commands = [
  langue,
  spawn,
  adminSettings,
  hintPokemon,
  information,
  stat,
  tutorial,
  howMuchThisPokemon,
  pokedex,
  effect,
  catchPokemon,
  code,
  trade,
];

export default (client: Client) => {
  if (!client?.user) {
    return newLogger("error", "Bot is not ready");
  }

  try {
    initializeBot(client);
    loadCommands(client);
  } catch (error) {
    newLogger(
      "error",
      error instanceof Error ? error.message : String(error),
      `Error in ready event for bot ${client.user.id}`,
    );
  }
};

function initializeBot(client: Client) {
  randomStatus(client);
  client.user!.setStatus("online");
  newLogger("info", "Bot is ready");
}

async function loadCommands(client: Client) {
  if (!client.application) return;

  try {
    const registeredCommands = await client.application.commands.fetch();

    const activeNames = new Set(
      commands.filter((c) => c.actif).map((c) => c.name),
    );

    for (const registered of registeredCommands.values()) {
      if (!activeNames.has(registered.name)) {
        await client.application.commands.delete(registered.id);
        newLogger("info", `Command "${registered.name}" deleted (not in list)`);
      }
    }

    for (const command of commands) {
      const exists = registeredCommands.find((c) => c.name === command.name);

      if (command.actif) {
        await client.application.commands.create(command.command);
        if (!exists) {
          newLogger("info", `Command "${command.name}" added`);
        }
      }
    }
  } catch (err) {
    newLogger(
      "error",
      err instanceof Error ? err.message : String(err),
      "Failed to load commands",
    );
  }
}
