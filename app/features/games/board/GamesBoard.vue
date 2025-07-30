<template>
    <div>
        <GamesBoardCreated v-if="game?.status === GameStatus.created" :game-id="game.gameId" />
        <GamesBoardPreparation v-if="game?.status === GameStatus.preparing" v-model="game" />
        <GamesBoardInProgress v-if="game?.status === GameStatus.inProgress" v-model="game" />
    </div>
</template>

<script lang="ts" setup>
import { GameStatus } from '~~/shared/enums/gameStatus';

const props = defineProps<{
    gameId: string
}>()

const gameApi = useGameByIdApi({ gameId: props.gameId })
const gamesApi = useGamesApi()
const player = usePlayer()
const game = computed(() => gameApi.data.value ?? null)

const joinedEvent = useJoinedEvent()
const readyEvent = useReadyEvent()
const startedEvent = useStartedEvent()
const updatedEvent = useUpdatedEvent()

onMounted(() => {
    $fetch(`/api/games/${props.gameId}/join`, {
        method: 'POST',
        body: { playerId: player.value.playerId }
    }).catch(() => {
        navigateTo('/')
    })
})

watch([joinedEvent], () => {
    gameApi.refresh()
}, { immediate: true })

watchEffect(() => {
    if (!readyEvent.value) return

    if (player.value.playerId !== readyEvent.value.playerId) {
        alert($t('enemyReady'))
    }
})

watchEffect(() => {
    if (!startedEvent.value) return

    gameApi.refresh()
    alert($t('starting'))
})

watchEffect(() => {
    if (updatedEvent.value?.status !== GameStatus.canceled) return

    $fetch(`/api/games/${props.gameId}/leave`).finally(() => {
        gamesApi.refresh()
        alert($t('gameCanceled'))
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