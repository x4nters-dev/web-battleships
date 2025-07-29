import { leaveGame } from "~~/server/utils/game"

export default defineEventHandler(async (event) => {
  const { gameId } = getRouterParams(event) as { gameId: string }
  const { playerId } = await readBody<{playerId: string }>(event)

  return leaveGame({ gameId, playerId })
})
