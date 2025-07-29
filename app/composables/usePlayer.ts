export const usePlayer = () => {
  return useState<{playerId: string | null}>('player', () => ({
    playerId: generateId(),
  }))
}
