import { getGames } from "~~/server/utils/game"
import type { GameListItem } from "~~/shared/types/gameListItem"

export default defineEventHandler(async (): Promise<GameListItem[]> => {
  return getGames()
})
