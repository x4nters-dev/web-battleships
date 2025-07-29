import { CellStatus } from "../enums/cellStatus";
import type { Board } from "../types/board";
import type { Cell } from "../types/cell";
import { range } from "./range";

export function generateBoard(params: {playerId: string}): Board {
    const rows: Cell[][] = []

    for (const rowIndex of range(0, 10)) {
        const row: Cell[] = []

        for (const columnIndex of range(0, 10)) {
            row.push({
                status: CellStatus.empty,
                x: rowIndex,
                y: columnIndex
            })
        }

        rows.push(row)
    }

    return {
        cells: rows,
        playerId: params.playerId,
        ready: false,
    }
}