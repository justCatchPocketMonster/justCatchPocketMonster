import { Client } from "discord.js";
import { readdirSync } from "fs";

import {newLogger} from "../middlewares/logger";
import randomStatus from "../features/other/randomStatus";

export default (client: Client) => {
  if (!client?.user) {
    return console.error("Bot is not ready");
  }

  try {
    initializeBot(client);
    loadCommands(client);
  } catch (error) {
    console.error("Bot is not ready");
    newLogger(
        'error',
        error as string,
        `Error in ready event for bot ${client.user.id}`,
    );
  }
};

function initializeBot(client: Client) {
  randomStatus(client);
  client.user!.setStatus("online");
  console.log("Bot is ready");
}

function loadCommands(client: Client) {
  const commandFolders = readdirSync("./src/commands");

  for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./src/commands/${folder}`);

    for (const file of commandFiles) {
      import(`../commands/${folder}/${file}`).then(async (commandModule) => {
        const { default: command } = commandModule;
        if (!client.application) return;

        const exists = client.application.commands.cache.find(
            (c) => c.name === command.name
        );

        if (command.actif) {
          await client.application.commands.create(command.command);
        } else if (exists) {
          await client.application.commands.delete(command.name);
        }

        console.log(`Command ${command.name} loaded and is active :${command.actif}`);
      });
    }
  }
}

