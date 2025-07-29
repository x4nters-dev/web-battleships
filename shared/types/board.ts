import type { Cell } from "./cell"

export type Board = {
    playerId: string
    cells: Cell[][]
    ready: boolean
}