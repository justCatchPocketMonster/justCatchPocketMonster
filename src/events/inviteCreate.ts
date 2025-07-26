import { Invite } from "discord.js";
import logger from "../middlewares/error";

export default (invite: Invite) => {
  try {
    // to remove if it's not use
  } catch (e) {
    logger.error(e);
  }
};
