import EventClass from "../../core/types/EventType";
import eventData from '../../data/eventData.json';

const selectEvent = (): EventClass => {

    let randomEvent = eventData[Math.floor(Math.random() * eventData.length)];
    return {
        ...randomEvent,
        id: randomEvent.id.toString(),
        effectDescription: "",
        endTime: new Date(Date.now() +  60 * 1000)
    };
}

export default selectEvent;