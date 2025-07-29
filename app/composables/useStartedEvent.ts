import { EventType } from "~~/shared/enums/events";

export function useStartedEvent() {
    return useState<StartedEvent | null>(EventType.started, () => null)
}