import type { _GettersTree } from "pinia"
import { EventType } from "~~/shared/enums/events"

type LastEvent<T extends EventType = EventType> = {
    eventType: T,
    payload: EventPayload<T>
}

type SseEventsState = {
    source: EventSource | null
    lastEvent: LastEvent | null
}

type SseEventsActions = {
    connect: (playerId: string) => void
    reconnect: (playerId: string) => void
    clearLastEvent: () => void
}

export const useSseEventsStore = defineStore<'sseEvents', SseEventsState, _GettersTree<SseEventsState>, SseEventsActions>('sseEvents', {
    state: () => ({
        source: null,
        lastEvent: null
    }),
    actions: {
        connect(playerId: string) {
            if (this.source) return

            const url = `/api/events?playerId=${playerId}`
            this.source = new EventSource(url)

            const eventTypes = Object.values(EventType)

            for (const eventType of eventTypes) {
                this.source.addEventListener(eventType, event => {
                    const payload = getEventData<typeof eventType>(event)
                    this.lastEvent = { eventType, payload }
                })
            }
        },
        reconnect(playerId: string) {
            this.source?.close()
            this.source = null

            this.connect(playerId)
        },
        clearLastEvent() {
            this.lastEvent = null
        },
    },
})