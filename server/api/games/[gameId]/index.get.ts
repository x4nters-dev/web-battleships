import { getGame } from "~~/server/utils/game"

export default defineEventHandler(async (event): Promise<Game | null> => {
  const { gameId } = getRouterParams(event) as { gameId: string }

  return getGame({ gameId })
})
