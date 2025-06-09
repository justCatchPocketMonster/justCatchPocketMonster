import EventClass from "../../types/EventType";
import eventData from '../../data/eventData.json';

const selectEvent = (): EventClass => {

    let randomEvent = eventData[Math.floor(Math.random() * eventData.length)];
    return {
        ...randomEvent,
        id: randomEvent.id.toString(),
        effectDescription: ""
    };
}

export default selectEvent;