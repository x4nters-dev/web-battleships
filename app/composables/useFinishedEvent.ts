import { EventType } from "~~/shared/enums/events";

export function useFinishedEvent() {
    return useState<FinishedEvent | null>(EventType.finished, () => null)
}