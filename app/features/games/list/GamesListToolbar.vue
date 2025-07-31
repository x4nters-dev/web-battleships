<template>
    <v-toolbar class="px-3">
        <v-btn :text="$t('create')" @click="create" />
        <v-btn :text="$t('changePlayerId')" @click="changePlayerId" />

        <template #append>
            <AppInfoIcon :player-id="player.playerId" />
        </template>
    </v-toolbar>
</template>

<script lang="ts" setup>
const player = usePlayer()
const sseEventsStore = useSseEventsStore()

function create(): void {
    $fetch('/api/games', {
        method: 'POST',
        body: { playerId: player.value.playerId }
    })
        .then(res => { navigateTo(`/${res.gameId}`) })
}

function changePlayerId(): void {
    const newPlayerId = generateId()
    player.value.playerId = newPlayerId
    sseEventsStore.reconnect(newPlayerId)
}
</script>