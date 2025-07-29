export const usePlayer = () => {
  return useState<{playerId: string}>('player', () => ({
    playerId: generateId(),
  }))
}
