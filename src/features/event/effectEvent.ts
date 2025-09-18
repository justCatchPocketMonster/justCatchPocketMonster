import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import language, { LanguageKey } from "../../lang/language";
import { ServerType } from "../../core/types/ServerType";
import {
  createPageForMenu,
  PageData,
  paginationMenu,
} from "../other/paginationMenu";
import eventSeasonalData from "../../data/eventSeasonalData.json";
import { EventSeasonnal } from "../../core/types/EventSeasonnal";
import {
  selectEventSeasonal,
  selectNextEventSeasonal,
} from "./selectEventSeasonal";

export const effectEvent = (
  interaction: ChatInputCommandInteraction,
  server: ServerType,
): void => {
  const pages: PageData[] = [];
  pages.push(selectEventStandard(server));
  const eventSeasonal = generateEmbedEventSeasonal(server);
  if (eventSeasonal) {
    pages.push(eventSeasonal);
  }
  paginationMenu(interaction, "Select an event", pages, 1, 60000);
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

function generateEmbedEventSeasonal(server: ServerType): PageData | undefined {
  const selected = selectEventSeasonal();

  if (!selected) {
    const nextEvent = selectNextEventSeasonal();
    if (!nextEvent?.startDate) {
      return undefined;
    }
    return createPageForMenu(
      new EmbedBuilder()
        .setColor("#000000" as ColorResolvable)
        .setTitle(language("noEvent", server.language))
        .setDescription(
          language("nextSeasonalEvent", server.language) +
            ` <t:${Math.floor(nextEvent.startDate.getTime() / 1000)}:D>`,
        ),
      null,
      language("seasonalEvent", server.language),
      language("noEvent", server.language),
    );
  }

  const embed = new EmbedBuilder()
    .setColor("#00AAFF" as ColorResolvable)
    .setTitle(language(selected.name, server.language))
    .setDescription(language(selected.description, server.language))
    .addFields({
      name: "End",
      value: selected.endDate
        ? `<t:${Math.floor(selected.endDate.getTime() / 1000)}:D>`
        : "-",
      inline: true,
    });

  return createPageForMenu(
    embed,
    null,
    language("seasonalEvent", server.language),
    language(selected.name, server.language),
  );
}
