import { Client, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";
import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";
import messageCreate from "./events/messageCreate";

import database from "./utils/database";

import { config } from "dotenv";
config();

async function main() {
  await database();

  const clientDiscord: Client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
    ],
  });

  clientDiscord.on("messageCreate", (message) =>
    messageCreate(clientDiscord, message),
  );
  clientDiscord.on("interactionCreate", (interaction) =>
    interactionCreate(clientDiscord, interaction),
  );
  clientDiscord.on("ready", () => ready(clientDiscord));

  await clientDiscord.login(process.env.DISCORD_TOKEN);

  const shutdown = async (signal: string) => {
    process.stdout.write(`\nReceived ${signal}, shutting down...\n`);
    clientDiscord.destroy();
    await mongoose.disconnect();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch(console.error);
