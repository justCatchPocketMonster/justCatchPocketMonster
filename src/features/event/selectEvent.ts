import EventType from "../../types/EventType";
import {getServer} from "../../cache/ServerCache";
import ServerType from "../../types/ServerType";
const eventData : EventType[] = require('../../data/event.json');

const selectEvent = (): EventType => {

    let randomEvent = eventData[Math.floor(Math.random() * eventData.length)];
    return randomEvent;
}

export default selectEvent;