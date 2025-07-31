<template>
    <div>
        <div v-if="game">
            <GamesBoardCreated v-if="createdStage" :game-id="game.gameId" @refresh-game="refreshGame" />
            <GamesBoardPreparation v-if="preparingStage" v-model="game" @refresh-game="refreshGame" />
            <GamesBoardInProgress v-if="inProgressStage" v-model="game" @refresh-game="refreshGame" />
        </div>
        <v-progress-circular v-else />
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
const createdStage = computed(() => game.value?.status === GameStatus.created)
const preparingStage = computed(() => game.value?.status === GameStatus.preparing)
const inProgressStage = computed(() => game.value?.status === GameStatus.inProgress)

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