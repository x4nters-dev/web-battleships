import { leaveGame } from "~~/server/utils/game"

export default defineEventHandler(async (event) => {
  const { gameId } = getRouterParams(event) as { gameId: string }
  const { playerId } = await readBody<{playerId: string }>(event)
  const { success } = leaveGame({ gameId, playerId })

  if (!success) return createError({
    status: 400,
    message: 'leave failed'
  })
})
