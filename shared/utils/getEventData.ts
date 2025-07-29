import type { EventType } from "../enums/events";
import type { EventPayload } from "../types/events";

export function getEventData<T extends EventType>(event: MessageEvent<string>): EventPayload<T> {
    return JSON.parse(event.data)
}