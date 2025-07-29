import { createGame } from "~~/server/utils/game"

export default defineEventHandler(async (event): Promise<{gameId: string}> => {
  const { playerId } = await readBody<{ playerId: string }>(event)

  return createGame({ playerId })
})
