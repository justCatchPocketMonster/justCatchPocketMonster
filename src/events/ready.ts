import { Client } from "discord.js";
import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { newLogger } from "../middlewares/logger";
import randomStatus from "../features/other/randomStatus";

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

function loadCommands(client: Client) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const commandsDir = join(__dirname, "../commands");
  const commandFolders = readdirSync(commandsDir);

  for (const folder of commandFolders) {
    const commandFiles = readdirSync(join(commandsDir, folder));

    for (const file of commandFiles) {
      import(`../commands/${folder}/${file}`)
        .then(async (commandModule) => {
          const { default: command } = commandModule;
          if (!client.application) return;

          const exists = client.application.commands.cache.find(
            (c) => c.name === command.name,
          );

          if (command.actif) {
            await client.application.commands.create(command.command);
          } else if (exists) {
            await client.application.commands.delete(command.name);
          }
        })
        .catch((err) => {
          newLogger(
            "error",
            err instanceof Error ? err.message : String(err),
            `Failed to load command ${folder}/${file}`,
          );
        });
    }
  }
}
