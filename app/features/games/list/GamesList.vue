<template>
    <div>
        <GamesListToolbar />
        <v-container>
            <v-row>
                <v-col v-for="game of sortedGames" :key="game.gameId" cols="12" lg="6" xl="4">
                    <GamesListItem :a-player-id="game.aPlayerId" :b-player-id="game.bPlayerId" :game-id="game.gameId"
                        :status="game.status" />
                </v-col>

                <v-col v-if="!games || games.length === 0" cols="12">
                    <GamesListEmpty />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { GameStatus } from '~~/shared/enums/gameStatus'


const gamesApi = useGamesApi()
const games = ref<GameListItem[]>([])
const createdEvent = useCreatedEvent()
const updatedEvent = useUpdatedEvent()
const removedEvent = useRemovedEvent()

const sortedGames = computed(() => games.value.slice().reverse())

watchEffect(() => {
    games.value = gamesApi.data.value ?? []
})

watchEffect(() => {
    if (!createdEvent.value) return

    games.value.push({
        aPlayerId: createdEvent.value!.aPlayerId,
        bPlayerId: null,
        gameId: createdEvent.value!.gameId,
        status: GameStatus.created,
    })
})

watchEffect(() => {
    if (!updatedEvent.value) return

    const gamesWithId = games.value.filter(g => g.gameId === updatedEvent.value?.gameId) ?? []

    console.log(games.value)

    for (const game of gamesWithId) {
        game.aPlayerId = updatedEvent.value.aPlayerId
        game.bPlayerId = updatedEvent.value.bPlayerId
        game.status = updatedEvent.value.status
    }
})

watchEffect(() => {
    if (!removedEvent.value) return

    games.value = games.value.filter(g => g.gameId !== removedEvent.value?.gameId) ?? []
})
</script>