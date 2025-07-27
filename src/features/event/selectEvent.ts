import {EventType} from "../../core/types/EventType";
import eventData from "../../data/eventData.json";

export const selectEvent = (): EventType => {
  let randomEvent = eventData[Math.floor(Math.random() * eventData.length)];
  return {
    ...randomEvent,
    id: randomEvent.id.toString(),
    effectDescription: "",
    endTime: new Date(Date.now() + 60 * 1000),
  };
};

