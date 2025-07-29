import { EventType } from "~~/shared/enums/events";

export function useShotEvent() {
    return useState<ShotEvent | null>(EventType.shot, () => null)
}