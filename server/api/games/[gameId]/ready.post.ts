import { setReadyState } from "~~/server/utils/game"
import type { Cell } from "~~/shared/types/cell"

export default defineEventHandler(async (event) => {
  const {gameId} = getRouterParams(event) as { gameId: string }
  const { playerId, cells } = await readBody<{ playerId: string, cells: Cell[][] }>(event)
  const { success } = setReadyState({ gameId, playerId, cells })

  if (!success) return createError({
    status: 400,
    message: 'changing ready state failed'
  })
})
