import { GuildMember } from "discord.js";
import logger from "../middlewares/error";

export default (Member: GuildMember) => {
  try {
    // to remove if it's not use
  } catch (e) {
    logger.error(e);
  }
};
