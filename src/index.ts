import { Client, GatewayIntentBits } from "discord.js";
import ready from "./events/ready";
import guildMemberAdd from "./events/guildMemberAdd";
import interactionCreate from "./events/interactionCreate";
import inviteDelete from "./events/inviteDelete";
import inviteCreate from "./events/inviteCreate";
import messageCreate from "./events/messageCreate";

import database from "./utils/database";

import { config } from "dotenv";
config();

async function main() {
  await database();

  var ClientDiscord: Client = new Client({
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
  ClientDiscord.on("inviteCreate", inviteCreate);
  ClientDiscord.on("inviteDelete", inviteDelete);
  ClientDiscord.on("interactionCreate", (interaction) =>
    interactionCreate(ClientDiscord, interaction),
  );
  ClientDiscord.on("guildMemberAdd", guildMemberAdd);

  ClientDiscord.on("ready", () => ready(ClientDiscord));
}

main();
