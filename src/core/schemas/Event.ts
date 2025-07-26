import mongoose from "mongoose";
import {EventType} from "../types/EventType";

export const EventSchema = new mongoose.Schema<EventType>(
    {
        id: {
            type: String,
            required: true,
            default: "",
        },
        name: {
            type: String,
            required: true,
            default: "",
        },
        description: {
            type: String,
            required: true,
            default: "",
        },
        type: {
            type: String,
            required: true,
            default: "",
        },
        color: {
            type: String,
            required: true,
            default: "",
        },
        image: {
            type: String,
            required: true,
            default: "",
        },
        effectDescription: {
            type: String,
            required: true,
            default: "",
        },
    },
    {
        _id: false,
        timestamps: false,
    },
);
