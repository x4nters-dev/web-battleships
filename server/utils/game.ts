import { GameStatus } from "~~/shared/enums/gameStatus"
import type { Game, ServerGame } from "~~/shared/types/game"
import { joinGameEvents, leaveGameEvents, registerGame, sendToAll } from "./events"
import { EventType } from "~~/shared/enums/events"
import type { Board } from "~~/shared/types/board"
import type { Cell } from "~~/shared/types/cell"
import { CellStatus } from "~~/shared/enums/cellStatus"
import { ShotStatus } from "~~/shared/enums/shotStatus"
import { logError } from "./logger"

const games = new Map<string, ServerGame>()

export function getGames(): GameListItem[] {
    return Array.from(games.values()).map(g => ({
        aPlayerId: g.aBoard.playerId,
        bPlayerId: g.bBoard?.playerId ?? null,
        gameId: g.gameId,
        status: g.status
    }))
}

export function getGame(params: {gameId: string}): Game | null {
    const game = games.get(params.gameId)

    return game ? {
        aBoard: game.aBoard,
        bBoard: game.bBoard,
        gameId: game.gameId,
        status: game.status,
    } : null
}

export function createGame(params: { playerId: string }): { gameId: string} {
    const gameId = generateId()
    const game: Game = {
        aBoard: generateBoard({ playerId: params.playerId }),
        bBoard: null,
        gameId,
        status: GameStatus.created,
    }

    games.set(gameId, game)
    
    registerGame({ gameId })
    
    sendToAll(EventType.created, { 
        aPlayerId: params.playerId, 
        gameId
    })
    
    resetTimeoutForGame(game)
    logInfo('game', `Created: ${gameId}`)

    return { gameId }
}

export function joinGame(params: { gameId: string, playerId: string }): { success: boolean } {
    const game = games.get(params.gameId)

    if (!game) {
        logError('game', `Invalid gameId: ${params.gameId}`)
        return { success: false }
    }

    if (params.playerId !== game.aBoard.playerId) {
        game.bBoard = generateBoard({ playerId: params.playerId })
        game.status = GameStatus.preparing
    }

    sendToAll(EventType.updated, {
        aPlayerId: game.aBoard?.playerId,
        bPlayerId: game.bBoard?.playerId ?? null,
        gameId: params.gameId,
        status: game.status
    })

    const { success } = joinGameEvents({ gameId: game.gameId, playerId: params.playerId })
    if (!success) return { success: false }

    resetTimeoutForGame(game)

    return { success: true }
}

export function terminateGame(params: {gameId: string}): { success: boolean } {
    const game = games.get(params.gameId)

    if (!game) {
        logError('game', `Invalid gameId: ${params.gameId}`)
        return { success: false }
    }

    if (game.aBoard.playerId) 
        leaveGame({gameId: game.gameId, playerId: game.aBoard.playerId})
    if (game.bBoard?.playerId)
        leaveGame({gameId: game.gameId, playerId: game.bBoard.playerId})
    
    game.status = GameStatus.canceled

    clearTimeout(game.timeout)

    sendToAll(EventType.updated, {
        aPlayerId: game.gameId,
        bPlayerId: game.bBoard?.playerId ?? null,
        gameId: game.gameId,
        status: game.status
    })

    games.delete(game.gameId)

    logInfo('game', `Ended: ${game.gameId}`)

    return { success: true }
}

export function setReadyState(params: { gameId: string, playerId: string, cells: Cell[][]}): { success: boolean } {
    const game = games.get(params.gameId)

    if (!game) {
        logError('game', `Invalid gameId: ${params.gameId}`)
        return { success: false }
    }

    let board: Board

    switch (params.playerId) {
        case game.aBoard.playerId:
            board = game.aBoard
            break
        case game.bBoard?.playerId:
            board = game.bBoard!
            break
        default:
            logError('game', `Invalid playerId: ${params.playerId}`)
            return { success: false }
    }

    board.cells = params.cells
    board.ready = true

    sendToGame(params.gameId, EventType.ready, {
        gameId: params.gameId,
        playerId: params.playerId
    })

    if (game.aBoard.ready && game.bBoard?.ready) {
        game.status = GameStatus.inProgress

        sendToGame(game.gameId, EventType.started, {
            gameId: game.gameId
        })

        sendToAll(EventType.updated, {
            aPlayerId: game.aBoard.playerId,
            bPlayerId: game.bBoard.playerId,
            gameId: game.gameId,
            status: game.status 
        })
    }

    logInfo('game', `Ready: ${game.gameId}`)
    resetTimeoutForGame(game)

    return { success: true }
}

export function tryShot(params: { attackerId: string, targetId: string, gameId: string, x: number, y: number }): { success: boolean } {
    const game = games.get(params.gameId)

    if (!game) {
        logError('sse', `Invalid gameId: ${params.gameId}`)
        return { success: false }
    }
    
    let target: Board;

    switch (params.targetId) {
        case game.aBoard.playerId:
            target = game.aBoard
            break
        case game.bBoard?.playerId:
            target = game.bBoard!
            break
        default:
            logError('game', `Invalid targetId: ${params.targetId}`)
            return { success: false }
    }

    const cell = target.cells[params.x][params.y]
    const shotStatus = cell.status === CellStatus.filled ? ShotStatus.hit : ShotStatus.missed
    cell.status = shotStatus === ShotStatus.hit ? CellStatus.hit : CellStatus.missed

    sendToGame(params.gameId, EventType.shot, {
        attackerId: params.attackerId,
        gameId: params.gameId,
        targetId: params.targetId,
        status: shotStatus,
        x: params.x,
        y: params.y,
    })

    const hits = target.cells.flat().filter(c => c.status === CellStatus.hit).length ?? 0

    if (hits >= 20) {
        sendToGame(params.gameId, EventType.finished, {
            gameId: params.gameId,
            winnerId: params.attackerId
        })

        game.status = GameStatus.finished

        sendToAll(EventType.updated, {
             aPlayerId: game.aBoard.playerId,
             bPlayerId: game.bBoard?.playerId ?? null,
             gameId: game.gameId,
             status: game.status,
        })

        setTimeout(() => {
            sendToAll(EventType.removed, {
                gameId: game.gameId
            })

            terminateGame(game)
        }, 10_000);
    }

    resetTimeoutForGame(game)

    return { success: true }
}

export function leaveGame(params: { gameId: string, playerId: string }): { success: boolean } {
    const game = games.get(params.gameId)

    if (!game) {
        logError('game', `Invalid gameId: ${params.gameId}`)
        return { success: false }
    }

    if (game.status !== GameStatus.finished) {
        game.status = GameStatus.canceled
        
        sendToAll(EventType.updated, {
            aPlayerId: game.aBoard.playerId,
            bPlayerId: game.bBoard?.playerId ?? null,
            gameId: game.gameId,
            status: game.status,
        })
    }

    const { final } = leaveGameEvents({ gameId: params.gameId, playerId: params.playerId })

    if (final) {
        sendToAll(EventType.removed, {
            gameId: params.gameId
        })

        setTimeout(() => {
            games.delete(params.gameId)
        }, 10000);
    }

    return { success: true }
}

function resetTimeoutForGame(game: ServerGame): void {
    clearTimeout(game.timeout)

    game.timeout = setTimeout(() => {
        logInfo('sse', `Timeout: ${game.gameId}`)
        terminateGame(game)
    }, 3_600_000)
} 