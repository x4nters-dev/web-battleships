export function useGameByIdApi(params: { gameId: string }) {
    return useFetch(`/api/games/${params.gameId}`, {
        key: `game:${params.gameId}`,
    })
}