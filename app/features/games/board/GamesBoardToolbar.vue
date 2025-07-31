<template>
    <v-toolbar class="px-3" :class="{ 'bg-green': playerTour }">
        <template #append>
            <span v-if="showEnemyReady" class="text-red px-4">{{ $t('enemyReady') }}</span>
            <span v-if="showWaitingForEnemyReady" class="text-blue px-4">{{ $t('waitingForEnemyReady') }}</span>
            <span v-if="tourLabel" class="px-4">{{ tourLabel }}</span>
            <AppInfoIcon :enemy-id="enemyId" :game-id="game?.gameId" :player-id="player.playerId" />
        </template>
        <v-btn v-if="gamePreparing" :text="$t('ready')" :disabled="props.readyDisabled" @click="emit('ready')" />
        <v-btn :text="$t('giveUp')" to="/" />
    </v-toolbar>
</template>

<script lang="ts" setup>
import { GameStatus } from '~~/shared/enums/gameStatus';

const player = usePlayer()

const props = defineProps<{
    readyDisabled?: boolean
    currentSide?: 'a' | 'b'
    playerSide?: 'a' | 'b'
    enemyReady?: boolean
}>()

const game = defineModel<Game | null>()

const emit = defineEmits<{
    (e: 'ready'): void,
}>()

const enemyId = computed(() => {
    if (player.value.playerId === game.value?.aBoard.playerId) {
        return game.value?.bBoard?.playerId
    }
    else {
        return game.value?.aBoard.playerId
    }
})
const gamePreparing = computed(() => game.value?.status === GameStatus.preparing)
const playerTour = computed(() => props.playerSide === props.currentSide && game.value?.status === GameStatus.inProgress)
const tourLabel = computed(() => {
    if (!props.currentSide || !props.playerSide) return null
    const tour = props.currentSide === props.playerSide ? $t('player') : $t('enemy')
    return `${$t('tour')}: ${tour}`
})
const showEnemyReady = computed(() => props.enemyReady && game.value?.status === GameStatus.preparing)
const showWaitingForEnemyReady = computed(() => !props.enemyReady && game.value?.status === GameStatus.preparing)
</script>