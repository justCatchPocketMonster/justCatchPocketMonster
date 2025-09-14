import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import language from "../../lang/language";
import { ServerType } from "../../core/types/ServerType";
import {
  createPageForMenu,
  PageData,
  paginationMenu,
} from "../other/paginationMenu";
import eventSeasonalData from "../../data/eventSeasonalData.json";
import { EventSeasonnal } from "../../core/types/EventSeasonnal";

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
  const now = new Date();
  const currentYear = now.getFullYear();

  const eventSeasonal: EventSeasonnal[] = eventSeasonalData.map((e) => ({
    id: e.id,
    name: e.name,
    startDate: e.startDate ? new Date(`${currentYear}-${e.startDate}`) : null,
    endDate: e.endDate ? new Date(`${currentYear}-${e.endDate}`) : null,
    image: e.image ?? null,
    statMultipliers: e.statMultipliers ?? {},
    description: e.description ?? "",
  }));

  const selected = eventSeasonal.find((event) => {
    if (!event.startDate || !event.endDate) return false;
    return now >= event.startDate && now <= event.endDate;
  });

  if (!selected) {
    const nextEvent = eventSeasonal.find((event) => {
      if (!event.startDate) return false;
      return now < event.startDate && event.startDate !== null;
    });
    if (!nextEvent || !nextEvent.startDate) {
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
      "Seasonal event",
      "None active",
    );
  }

  const embed = new EmbedBuilder()
    .setColor("#00AAFF" as ColorResolvable)
    .setTitle(selected.name)
    .setDescription(selected.description)
    .addFields({
      name: "End",
      value: selected.endDate
        ? `<t:${Math.floor(selected.endDate.getTime() / 1000)}:D>`
        : "-",
      inline: true,
    });

  return createPageForMenu(embed, null, "Seasonal event", selected.name);
}
