<template>
    <v-tooltip>
        <template #activator="{ props: activatorProps }">
            <div v-bind="activatorProps">
                <v-icon icon="mdi-information-outline" />
            </div>
        </template>

        <p>{{ playerLabel }}</p>
        <p>{{ enemyLabel }}</p>
        <p>{{ gameLabel }}</p>
    </v-tooltip>
</template>

<script lang="ts" setup>
const props = defineProps<{
    gameId?: string
    enemyId?: string
    playerId?: string
}>()

const playerLabel = computed(() => props.playerId ? `${$t('player')}: ${props.playerId}` : null)
const gameLabel = computed(() => props.gameId ? `${$t('game')}: ${props.gameId}` : null)
const enemyLabel = computed(() => props.enemyId ? `${$t('enemy')}: ${props.enemyId}` : null)
</script>
