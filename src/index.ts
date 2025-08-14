import { Client, GatewayIntentBits } from "discord.js";
import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";
import messageCreate from "./events/messageCreate";

import database from "./utils/database";

import { config } from "dotenv";
config();

async function main() {
  await database();

  const ClientDiscord: Client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
    ],
  });

  await ClientDiscord.login(process.env.DISCORD_TOKEN);

  ClientDiscord.on("messageCreate", (message) =>
    messageCreate(ClientDiscord, message),
  );
  ClientDiscord.on("interactionCreate", (interaction) =>
    interactionCreate(ClientDiscord, interaction),
  );

  ClientDiscord.on("ready", () => ready(ClientDiscord));
}

main();
