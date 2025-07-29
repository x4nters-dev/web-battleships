import type { EventType } from "~~/shared/enums/events"
import type { EventPayloadListener } from "~~/shared/types/events"

export function useEventSource() {
    let source: EventSource | null = null
    const listeners = ref<{eventType: EventType, listener: (event: MessageEvent<EventType>) => void}[]>([])
    const player = usePlayer()

    function on<T extends EventType>(eventType: T, callback: EventPayloadListener<T>): void {
        const listener = (event: MessageEvent<EventType>) => {
            callback(getEventData<T>(eventType, event))
        }

        source?.addEventListener(eventType, listener)
        listeners.value.push({eventType, listener})
    }

    function off<T extends EventType>(eventType: T): void {
        for (const savedListener of listeners.value) {
            if (savedListener.eventType === eventType) {
                source?.removeEventListener(eventType, savedListener.listener)
            }
        }
    }

    watchEffect(() => {
        source?.close()
        source = new EventSource(`/api/events?playerId=${player.value.playerId}`)
    })

    onBeforeUnmount(() => {
        source?.close()
    })

    return { on, off }
}