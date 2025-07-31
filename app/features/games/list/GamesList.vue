<template>
    <div>
        <GamesListToolbar />
        <v-container>
            <v-row>
                <v-col v-for="game of sortedGames" :key="game.gameId" cols="12" lg="6" xl="4">
                    <GamesListItem :a-player-id="game.aPlayerId" :b-player-id="game.bPlayerId" :game-id="game.gameId"
                        :status="game.status" />
                </v-col>
                <v-col v-if="isGameListEmpty" cols="12">
                    <GamesListEmpty />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { EventType } from '~~/shared/enums/events'
import { GameStatus } from '~~/shared/enums/gameStatus'

const gamesApi = useGamesApi()
const sseEventsStore = useSseEventsStore()

const games = ref<GameListItem[]>([])

const sortedGames = computed(() => games.value.slice().reverse())
const isGameListEmpty = computed(() => !games.value || games.value.length === 0)

function onCreated(payload: CreatedEvent): void {
    games.value.push({
        aPlayerId: payload.aPlayerId,
        bPlayerId: null,
        gameId: payload.gameId,
        status: GameStatus.created
    })
}

function onUpdated(payload: UpdatedEvent): void {
    const game = games.value.find(g => g.gameId === payload.gameId)

    if (!game) return

    game.aPlayerId = payload.aPlayerId
    game.bPlayerId = payload.bPlayerId
    game.status = payload.status
}

function onRemoved(payload: RemovedEvent): void {
    games.value = games.value.filter(g => g.gameId !== payload.gameId)
}

watchEffect(() => {
    games.value = gamesApi.data.value ?? []
})

watchEffect(() => {
    if (!sseEventsStore.lastEvent) return
    const { eventType, payload } = sseEventsStore.lastEvent

    switch (eventType) {
        case EventType.created:
            onCreated(payload as CreatedEvent)
            break
        case EventType.updated:
            onUpdated(payload as UpdatedEvent)
            break
        case EventType.removed:
            onRemoved(payload as RemovedEvent)
            break
    }

    sseEventsStore.clearLastEvent()
})
</script>