import { cloneDeep } from "es-toolkit";
import type { Board } from "../types/board";
import { CellStatus } from "../enums/cellStatus";
import type { Cell } from "../types/cell";
import type { Fleet } from "../types/fleet";

const directions: [number, number][] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const maxAllowed: Fleet = {
  4: 1,
  3: 2,
  2: 3,
  1: 4,
};

export function validateBoard(board: Board, changedCell: Cell): Fleet | null  {
  const filled = board.cells.flat().filter(c => c.status === CellStatus.filled).length ?? 0

  const {status, x, y} = changedCell

  if (status === CellStatus.empty && filled >= 20) {
    return null
  }

  const newBoard = cloneDeep(board)
  const targetCell = newBoard.cells[x]![y]!
  targetCell.status = CellStatus.filled

  if (!validateShips(newBoard)) return null

  return countShips(newBoard)
}

function countShips(board: Board): Fleet {
  const visited = new Set<string>();
  const shipCount: Fleet = { 1: 0, 2: 0, 3: 0, 4: 0 };

  for (let x = 0; x < board.cells.length; x++) {
    for (let y = 0; y < board.cells[0]!.length; y++) {
      const key = `${x},${y}`;
      if (isFilled(board, x, y) && !visited.has(key)) {
        const ship = getShipCells(board, x, y, visited);
        if (isStraightLine(ship)) {
          const length = ship.length
          if (length >= 1 && length <= 4) {
            shipCount[length]!++;
          }
        }
      }
    }
  }

  return shipCount;
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

  if (hasDiagonalAdjacency(board)) return false;
  return isValidShipCount(shipLengths);
}

function hasDiagonalAdjacency(board: Board): boolean {
  const diagonals: [number, number][] = [
    [-1, -1], [-1, 1], [1, -1], [1, 1],
  ];

  for (let x = 0; x < board.cells.length; x++) {
    for (let y = 0; y < board.cells[0]!.length; y++) {
      if (board.cells[x]![y]!.status !== CellStatus.filled) continue;

      for (const [dx, dy] of diagonals) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 && nx < board.cells.length &&
          ny >= 0 && ny < board.cells[0]!.length &&
          board.cells[nx]![ny]!.status === CellStatus.filled
        ) {
          return true; // Znalazł sąsiednią komórkę po przekątnej
        }
      }
    }
  }

  return false;
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
      const num = counts[+len] as number
      if (num > (maxAllowed[+len] || 0)) {
          return false;
      }
  }

  return true;
}