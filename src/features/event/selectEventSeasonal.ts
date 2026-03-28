import eventSeasonalData from "../../data/json/eventSeasonalData.json";
import { EventSeasonnal } from "../../core/types/EventSeasonnal";
import { LanguageKey } from "../../lang/language";

function convertJsonToObject(): EventSeasonnal[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  return eventSeasonalData.map((event) => ({
    id: event.id,
    name: event.name as LanguageKey,
    startDate: event.startDate
      ? new Date(`${currentYear}-${event.startDate}`)
      : null,
    endDate: event.endDate ? new Date(`${currentYear}-${event.endDate}`) : null,
    image: event.image ?? null,
    statMultipliers: event.statMultipliers ?? {},
    description: event.description as LanguageKey,
  }));
}

export const selectEventSeasonal = () => {
  const now = new Date();
  const eventSeasonal = convertJsonToObject();

  const selected = eventSeasonal.find((event) => {
    if (!event.startDate || !event.endDate) return false;
    return now >= event.startDate && now <= event.endDate;
  });
  return selected;
};

export const selectNextEventSeasonal = () => {
  const currentTime = new Date();
  const eventSeasonal = convertJsonToObject();
  const nowEpoch = currentTime.getTime();

  const nextUpcomingEvent = eventSeasonal.reduce<EventSeasonnal>(
    (currentBest, candidate) => {
      const bestStartEpoch = currentBest.startDate?.getTime() ?? Infinity;
      const candidateStartEpoch = candidate.startDate?.getTime() ?? Infinity;

      const bestIsAfterNow = bestStartEpoch > nowEpoch;
      const candidateIsAfterNow = candidateStartEpoch > nowEpoch;

      if (
        candidateIsAfterNow &&
        (!bestIsAfterNow || candidateStartEpoch < bestStartEpoch)
      ) {
        return candidate;
      }

      return currentBest;
    },
    eventSeasonal[0],
  );

  return nextUpcomingEvent;
};
