import EventType from "../../types/EventType";
import eventData from '../../data/eventData.json';

const selectEvent = (): EventType => {

    let randomEvent = eventData[Math.floor(Math.random() * eventData.length)];
    return {
        ...randomEvent,
        id: randomEvent.id.toString(),
        effectDescription: ""
    };
}

export default selectEvent;