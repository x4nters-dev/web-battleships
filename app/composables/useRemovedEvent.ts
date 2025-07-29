import { EventType } from "~~/shared/enums/events";

export function useRemovedEvent() {
    return useState<RemovedEvent | null>(EventType.removed, () => null)
}