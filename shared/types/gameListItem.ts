import type { GameStatus } from "../enums/gameStatus"

export type GameListItem = {
    gameId: string
    aPlayerId: string | null
    bPlayerId: string | null
    status: GameStatus
}