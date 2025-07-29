<template>
    <v-toolbar>
        <template #append>
            <p>{{ tourLabel }}</p>
            <AppInfoIcon :enemy-id="enemyId" :game-id="game?.gameId" :player-id="player.playerId" />
        </template>

        <v-btn v-if="game?.status === GameStatus.preparing" :text="$t('ready')" :disabled="props.readyDisabled"
            @click="emit('ready')" />
        <v-btn :text="$t('giveUp')" to="/" />
    </v-toolbar>
</template>

<script lang="ts" setup>
import { GameStatus } from '~~/shared/enums/gameStatus';

const game = defineModel<Game | null>()
const player = usePlayer()

const props = defineProps<{
    readyDisabled?: boolean
    currentSide?: 'a' | 'b'
    playerSide?: 'a' | 'b'
}>()

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

const tourLabel = computed(() => {
    if (!props.currentSide || !props.playerSide) return null

    const tour = props.currentSide === props.playerSide ? $t('player') : $t('enemy')

    return `${$t('tour')}: ${tour}`
})
</script>