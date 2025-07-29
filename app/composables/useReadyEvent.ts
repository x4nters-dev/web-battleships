import { EventType } from "~~/shared/enums/events";

export function useReadyEvent() {
    return useState<ReadyEvent | null>(EventType.ready, () => null)
}