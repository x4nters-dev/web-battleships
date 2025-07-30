import { EventType } from '~~/shared/enums/events'
import type { H3Event } from 'h3'
import type { SseClient } from '~~/shared/types/sseClient'
import type { EventPayload } from '~~/shared/types/events'
import { logError, logInfo } from './logger'

const clients = new Map<string, SseClient>()
const games = new Map<string, SseClient[]>()

export function connect(params: {event: H3Event, playerId: string}): {playerId: string} {
    const {req, res} = params.event.node
    const { event, playerId } = params
    
    setResponseHeaders(event, {
        'Content-Type': 'text/event-stream',
        "Cache-Control": 'no-cache',
        'Connection': 'keep-alive',
    })
    
    req.on('close', () => {
        res.end()
        clients.delete(playerId)
        logInfo('sse', `Disconnected: ${playerId}`)
    })
    
    res.flushHeaders()
    
    const client: SseClient = { playerId, event }
    clients.set(playerId, client)
 
    res.write(wrapEventPayload(EventType.connected, { playerId }))

    logInfo('sse', `Connected: ${playerId}`)

    return { playerId }
}

export function registerGame(params: {gameId: string }): void {
    games.set(params.gameId, [])
} 

// TODO: check why every new game is closed after first one
export function joinGameEvents(params: {gameId: string, playerId: string}): void {
    const player = clients.get(params.playerId)

    if (!player) {
        logError('sse', `aa Invalid playerId: ${params.playerId}`)
        return 
    }

    games.get(params.gameId)?.push(player)
    sendToGame(params.gameId, EventType.joined, {
        bPlayerId: params.playerId,
        gameId: params.gameId
    })
}

export function leaveGameEvents(params: {gameId: string, playerId: string}): { final: boolean } {
    const game = games.get(params.gameId)

    if (!game) {
        return { final: true }
    }
    
    games.set(params.gameId, game.filter(g => g.playerId !== params.playerId) ?? [])

    if (games.get(params.gameId)?.length === 0) {
        games.delete(params.gameId) 

        return { final: true }
    }

    return { final: false }
}

export function sendToAll<T extends EventType>(eventType: T, payload: EventPayload<T>): void {
    for (const [_, { event }] of clients) {
        event.node.res.write(wrapEventPayload(eventType, payload))
    } 
}

export function sendToGame<T extends EventType>(gameId: string, eventType: T, payload: EventPayload<T>): void {
    const game = games.get(gameId)

    if (!game) {
        logError('sse', `Invalid gameId: ${gameId}`)
        throw Error('Invalid gameId')
    }

    const players = Array.from(game.values())

    for (const { event } of players) {
        event.node.res.write(wrapEventPayload(eventType, payload))
    }
}

function wrapEventPayload<T extends EventType>(eventType: T, payload: EventPayload<T>): string {
    return `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`
}