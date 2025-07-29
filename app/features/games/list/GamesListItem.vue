<template>
    <v-card :title="title" :subtitle="props.gameId">
        <template #prepend>
            <AppGameStatusIcon :status="props.status" />
        </template>
        <template #actions>
            <v-btn :text="$t('join')" :to="to" :disabled="joinDisabled" />
        </template>
    </v-card>
</template>

<script lang="ts" setup>
import { GameStatus } from '~~/shared/enums/gameStatus';

const props = defineProps<{
    gameId: string
    aPlayerId: string | null
    bPlayerId: string | null
    status: GameStatus
}>()

const title = computed(() => `${props.aPlayerId ?? '-'} vs ${props.bPlayerId ?? '-'}`)
const to = computed(() => `/${props.gameId}`)
const joinDisabled = computed(() => props.status !== GameStatus.created)
</script>