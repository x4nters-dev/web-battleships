export default defineEventHandler(async (event) => {
  const { playerId } = getQuery(event) as { playerId: string }
  const { success } = connect({ event, playerId })

  if (!success) return createError({
    message: 'connection failed',
    status: 400,
  })
})
