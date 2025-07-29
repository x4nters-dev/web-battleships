<template>
    <v-icon :icon="icon" />
</template>

<script lang="ts" setup>
import { GameStatus } from '~~/shared/enums/gameStatus';

const props = defineProps<{
    status: GameStatus
}>()

const icon = computed(() => {
    switch (props.status) {
        case GameStatus.canceled:
            return 'mdi-close'
        case GameStatus.created:
            return 'mdi-moon-new'
        case GameStatus.finished:
            return 'mdi-check'
        case GameStatus.inProgress:
            return 'mdi-fencing'
        case GameStatus.preparing:
            return 'mdi-widgets-outline'
        default:
            return ''
    }
})
</script>