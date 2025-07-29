import { EventType } from "~~/shared/enums/events";

export function useUpdatedEvent() {
    return useState<UpdatedEvent | null>(EventType.updated, () => null)
}