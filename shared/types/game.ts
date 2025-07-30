import type { GameStatus } from "../enums/gameStatus"
import type { Board } from "./board"

export type Game = {
    gameId: string
    aBoard: Board
    bBoard: Board | null
    status: GameStatus

    timeout?: NodeJS.Timeout
}