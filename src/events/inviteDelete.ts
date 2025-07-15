import { Invite } from "discord.js";
import logger from "../middlewares/error";

export default (invite: Invite) => {
  try {
  } catch (e) {
    logger.error(e);
  }
};
