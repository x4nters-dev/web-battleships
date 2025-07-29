import { cloneDeep } from "es-toolkit";
import type { Board } from "../types/board";
import { CellStatus } from "../enums/cellStatus";
import type { Cell } from "../types/cell";

const directions: [number, number][] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const maxAllowed: Record<number, number> = {
  4: 1,
  3: 2,
  2: 3,
  1: 4,
};

export function validateBoard(board: Board, changedCell: Cell): boolean {
  const filled = board.cells.flat().filter(c => c.status === CellStatus.filled).length ?? 0

  const {status, x, y} = changedCell

  if (status === CellStatus.empty && filled >= 20) {
    return false
  }

  const newBoard = cloneDeep(board)
  const targetCell = newBoard.cells[x]![y]!
  targetCell.status = CellStatus.filled

  return validateShips(newBoard)
}
 

function validateShips(board: Board): boolean {
  const visited = new Set<string>();
  const shipLengths: number[] = [];

  for (let x = 0; x < board.cells.length; x++) {
      for (let y = 0; y < board.cells[0]!.length; y++) {
          const key = `${x},${y}`; 
          if (isFilled(board, x, y) && !visited.has(key)) {
              const ship = getShipCells(board, x, y, visited);
              if (!isStraightLine(ship)) return false;
              shipLengths.push(ship.length);
          }
      }
  }

  return isValidShipCount(shipLengths);
}

function isFilled(board: Board, x: number, y: number): boolean {
  return (
      x >= 0 &&
      y >= 0 &&
      x < board.cells.length &&
      y < board.cells[0]!.length &&
      board.cells[x]![y]!.status === CellStatus.filled
  );
}

function getShipCells(board: Board, x: number, y: number, visited: Set<string>): [number, number][] {
  const stack = [[x, y]];
  const cells: [number, number][] = [];


  while (stack.length) {
      const [cx, cy] = stack.pop() as [number, number]
      const key = `${cx},${cy}`;
      if (visited.has(key)) continue;

      visited.add(key);
      cells.push([cx, cy]);

      for (const [dx, dy] of directions) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (isFilled(board, nx, ny)) {
              stack.push([nx, ny]);
          }
      }
  }

  return cells;
}

function isStraightLine(cells: [number, number][]): boolean {
  const allX = cells.map(([x]) => x);
  const allY = cells.map(([, y]) => y);
  const uniqueX = new Set(allX);
  const uniqueY = new Set(allY);

  return uniqueX.size === 1 || uniqueY.size === 1;
}

function isValidShipCount(shipLengths: number[]): boolean {
  const counts: Record<number, number> = {};

  for (const len of shipLengths) {
      counts[len] = (counts[len] || 0) + 1;
  }

  for (const len in counts) {
      const num = counts[+len] as number;
      if (num > (maxAllowed[+len] || 0)) {
          return false;
      }
  }

  return true;
}