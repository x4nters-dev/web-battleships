import { tryShot } from "~~/server/utils/game"

export default defineEventHandler(async (event) => {
  const { gameId } = getRouterParams(event) as { gameId: string }
  const { attackerId, targetId, x, y } = await readBody<{ attackerId: string, targetId: string, x: number, y: number }>(event)
  const { success } = tryShot({ attackerId, gameId, targetId, x, y })

  if (!success) return createError({
    status: 400,
    message: 'shot failed'
  })
})
