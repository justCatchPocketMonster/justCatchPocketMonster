import { Client, ActivityType } from "discord.js";
import { getStatById } from "../../cache/StatCache";
import { newLogger } from "../../middlewares/logger";
import { getCode } from "../code/code";
import { nameStatGeneral, version } from "../../config/default/misc";
import { random } from "../../utils/helperFunction";

const randomStatus = async (Client: Client) => {
  try {
    if (!Client?.user) return;

    const statGlobal = await getStatById(nameStatGeneral);

    let arrayStatus = [
      "Je suis en " + version + " :D",
      "Je suis désolé les anglophones, je suis français.",
      statGlobal.pokemonSpawned + " Pokémon sont apparus depuis le début.",
      statGlobal.pokemonCaught + " Pokémon ont été capturés.",
      "La MAJ finale est sortie.",
      "I'm on " + version + " :D",
      "I'm sorry English speakers I'm French.",
      statGlobal.pokemonSpawned + " pokemon have spawned from the start.",
      statGlobal.pokemonCaught + " pokemon have been catched.",
      "The final update is out.",
      "Meilleure chaîne SOS : " + statGlobal.bestSosChain,
      statGlobal.raidsWon + " raids ont été gagnés.",
      "!code " + getCode()["shiny"][random(getCode()["shiny"].length)],
    ];
    let nbStatus = arrayStatus.length;
    let randomStatus = random(nbStatus);

    Client.user.setActivity(arrayStatus[randomStatus], {
      type: ActivityType.Watching,
    });
  } catch (e) {
    newLogger(
      "error",
      e as string,
      `Error in randomStatus function for client ${Client.user?.id}`,
    );
  }
};

export default randomStatus;
