import EventType from '../types/EventType';

export class Event implements EventType {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public type: string,
        public color: string,
        public image: string,
        public effectDescription: string,
        public endTime: Date,
    ) {}
}
