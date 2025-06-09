
class EventType {
    "id": string;
    "name": string;
    "description": string;
    "type": string;
    "color": string;
    "image": string;
    "effectDescription": string|null;

    constructor(id: string, name: string, description: string, type: string, color: string, image: string, effectDescription: string|null = null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.color = color;
        this.image = image;
        this.effectDescription = effectDescription;
    }
}

export default EventType;
    