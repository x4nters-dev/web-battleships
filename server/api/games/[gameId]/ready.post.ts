import { setReadyState } from "~~/server/utils/game"
import type { Cell } from "~~/shared/types/cell"

export default defineEventHandler(async (event) => {
  const {gameId} = getRouterParams(event) as { gameId: string }
  const { playerId, cells } = await readBody<{ playerId: string, cells: Cell[][] }>(event)

  return setReadyState({ gameId, playerId, cells })
})
