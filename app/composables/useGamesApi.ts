export function useGamesApi() {
    return useFetch('/api/games', {
        key: 'games'
    })
}