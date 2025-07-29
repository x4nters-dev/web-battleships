import type { H3Event } from 'h3'

export type SseClient = {
    playerId: string
    event: H3Event
}