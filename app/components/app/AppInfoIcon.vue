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
}>()

const player = usePlayer()

const playerLabel = computed(() => `${$t('player')}: ${player.value.playerId}`)
const gameLabel = computed(() => props.gameId ? `${$t('game')}: ${props.gameId}` : null)
const enemyLabel = computed(() => props.enemyId ? `${$t('enemy')}: ${props.enemyId}` : null)
</script>
