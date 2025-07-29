import { EventType } from "~~/shared/enums/events";

export function useJoinedEvent() {
    return useState<JoinedEvent | null>(EventType.joined, () => null)
}