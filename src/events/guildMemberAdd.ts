import { GuildMember } from "discord.js";
import logger from "../middlewares/error";

export default (Member: GuildMember) => {
  try {
  } catch (e) {
    logger.error(e);
  }
};
