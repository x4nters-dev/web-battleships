import type { EventType } from "../enums/events"
import type { GameStatus } from "../enums/gameStatus"
import type { ShotStatus } from "../enums/shotStatus"

export type ConnectedEvent = {
    playerId: string
}

export type CreatedEvent = { 
    gameId: string
    aPlayerId: string
}

export type UpdatedEvent = {
    gameId: string
    aPlayerId: string
    bPlayerId: string | null
    status: GameStatus
}

export type JoinedEvent = {
    gameId: string
    bPlayerId: string
}

export type ReadyEvent = {
    gameId: string
    playerId: string
}

export type StartedEvent = {
    gameId: string
}

export type ShotEvent = {
    gameId: string
    attackerId: string
    targetId: string
    x: number
    y: number
    status: ShotStatus
}

export type FinishedEvent = {
    gameId: string
    winnerId: string
}

export type RemovedEvent = {
    gameId: string
}

type EventMap = {
    [EventType.connected]: ConnectedEvent,
    [EventType.created]: CreatedEvent, 
    [EventType.joined]: JoinedEvent,
    [EventType.ready]: ReadyEvent,
    [EventType.started]: StartedEvent,
    [EventType.shot]: ShotEvent,
    [EventType.updated]: UpdatedEvent,
    [EventType.finished]: FinishedEvent,
    [EventType.removed]: RemovedEvent,
}

export type EventPayload<T extends EventType> = EventMap[T]