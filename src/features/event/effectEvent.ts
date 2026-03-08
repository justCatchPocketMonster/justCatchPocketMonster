import {
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
import {
  selectEventSeasonal,
  selectNextEventSeasonal,
} from "./selectEventSeasonal";
import { formatTimestamp } from "../../utils/helperFunction";
import { getImageUrl } from "../../utils/imageUrl";

export const effectEvent = async (
  interaction: ChatInputCommandInteraction,
  server: ServerType,
): Promise<void> => {
  const pages: PageData[] = [];
  pages.push(await selectEventStandard(server));
  const eventSeasonal = generateEmbedEventSeasonal(server);
  if (eventSeasonal) {
    pages.push(eventSeasonal);
  }
  paginationMenu(interaction, "Select an event", pages, 1, 60000);
};

async function selectEventStandard(server: ServerType): Promise<PageData> {
  const event = server.eventSpawn;
  if (event.whatEvent) {
    const dateEnd = new Date(event.whatEvent.endTime);
    const imageName = event.whatEvent.image + ".png";
    const imageUrl = await getImageUrl("eventImage", imageName);

    const eventEmbed = new EmbedBuilder()
      .setColor(event.whatEvent.color as ColorResolvable)
      .setTitle(language("actualEvent", server.settings.language))
      .addFields({
        name: language("effect", server.settings.language),
        value: event.whatEvent.effectDescription,
        inline: false,
      })
      .addFields({
        name: language("timeLeft", server.settings.language),
        value: formatTimestamp(dateEnd.getTime()),
        inline: false,
      })
      .setImage(imageUrl);

    return createPageForMenu(eventEmbed, null, "name", "description");
  }
  return createPageForMenu(
    new EmbedBuilder()
      .setColor("#000000" as ColorResolvable)
      .setTitle(language("noEvent", server.settings.language)),
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
        .setTitle(language("noEvent", server.settings.language))
        .setDescription(
          language("nextSeasonalEvent", server.settings.language) +
            formatTimestamp(nextEvent.startDate.getTime()),
        ),
      null,
      language("seasonalEvent", server.settings.language),
      language("noEvent", server.settings.language),
    );
  }

  const embed = new EmbedBuilder()
    .setColor("#00AAFF" as ColorResolvable)
    .setTitle(language(selected.name, server.settings.language))
    .setDescription(language(selected.description, server.settings.language))
    .addFields({
      name: "End",
      value: selected.endDate
        ? formatTimestamp(selected.endDate.getTime())
        : "-",
      inline: true,
    });

  return createPageForMenu(
    embed,
    null,
    language("seasonalEvent", server.settings.language),
    language(selected.name, server.settings.language),
  );
}
