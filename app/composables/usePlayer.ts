export const usePlayer = () => {
  return useState<{playerId: string}>('player', () => ({
    playerId: getPlayerId()
  }))
}

function getPlayerId(): string {
  let id = localStorage.getItem('playerId')

  if (!id) {
    id = generateId()
    localStorage.setItem('playerId', id)
  } 

  return id
}
