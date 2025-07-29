import { EventType } from "~~/shared/enums/events";

export function useConnectedEvent() {
    return useState<ConnectedEvent | null>(EventType.connected, () => null)
}