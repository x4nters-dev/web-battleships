export default defineEventHandler(async (event) => {
  const { playerId } = getQuery(event) as { playerId: string }
  connect({ event, playerId })
})
