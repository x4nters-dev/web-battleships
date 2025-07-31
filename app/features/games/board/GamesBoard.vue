<template>
    <div>
        <GamesBoardCreated v-if="game?.status === GameStatus.created" :game-id="game.gameId"
            @refresh-game="refreshGame" />
        <GamesBoardPreparation v-if="game?.status === GameStatus.preparing" v-model="game"
            @refresh-game="refreshGame" />
        <GamesBoardInProgress v-if="game?.status === GameStatus.inProgress" v-model="game" />
    </div>
</template>

<script lang="ts" setup>
import { GameStatus } from '~~/shared/enums/gameStatus';

const props = defineProps<{
    gameId: string
}>()

const gameApi = useGameByIdApi({ gameId: props.gameId })
const player = usePlayer()
const game = computed(() => gameApi.data.value ?? null)

function refreshGame(): void {
    gameApi.refresh()
}

onMounted(() => {
    $fetch(`/api/games/${props.gameId}/join`, {
        method: 'POST',
        body: { playerId: player.value.playerId }
    }).catch(() => {
        navigateTo('/')
    })
})

onBeforeUnmount(() => {
    $fetch(`/api/games/${props.gameId}/leave`, {
        method: 'POST',
        body: {
            playerId: player.value.playerId
        }
    })
})
</script>