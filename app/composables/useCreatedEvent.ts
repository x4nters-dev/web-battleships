import { EventType } from "~~/shared/enums/events";

export function useCreatedEvent() {
    return useState<EventPayload<EventType.created> | null>(EventType.created, () => null)
}