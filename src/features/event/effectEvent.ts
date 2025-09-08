import { AttachmentBuilder, ColorResolvable, EmbedBuilder } from "discord.js";
import language from "../../lang/language";
import { ServerType } from "../../core/types/ServerType";
import { createPageForMenu, PageData } from "../other/paginationMenu";
import eventSeasonalData from "../../data/eventSeasonalData.json";
import { EventSeasonnal } from "../../core/types/EventSeasonnal";

export const effectEvent = () => {
  // Implementation for applying event effects
};

function selectEventStandard(server: ServerType): PageData {
  let event = server.eventSpawn;
  if (event.whatEvent) {
    let dateEnd = new Date(event.whatEvent.endTime);

    let adressImage =
      "./src/assets/eventImage/" + event.whatEvent.image + ".png";
    let nameImage = event.whatEvent.image + ".png";

    let pokeImg = new AttachmentBuilder(adressImage);

    let eventEmbed = new EmbedBuilder()
      .setColor(event.whatEvent.color as ColorResolvable)
      .setTitle(language("actualEvent", server.language))
      .addFields({
        name: language("effect", server.language),
        value: event.whatEvent.effectDescription,
        inline: false,
      })
      .addFields({
        name: language("timeLeft", server.language),
        value: `<t:${dateEnd.getTime()}:R>`,
        inline: false,
      })
      .setImage("attachment://" + nameImage);

    return createPageForMenu(eventEmbed, pokeImg, "name", "description");
  }
  return createPageForMenu(
    new EmbedBuilder()
      .setColor("#000000" as ColorResolvable)
      .setTitle(language("noEvent", server.language)),
    null,
    "name",
    "description",
  );
}

function generateEmbedEventSeasonal(): PageData {
  const eventSeasonal: EventSeasonnal[] = eventSeasonalData;
  const now = new Date();

  const selectEvent = eventSeasonal.find((event) => {
    event.startDate = new Date(event.startDate);
    event.endDate = new Date(event.endDate);
    return now >= event.startDate && now <= event.endDate;
  });
}
