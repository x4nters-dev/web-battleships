<template>
    <v-toolbar>
        <v-btn :text="$t('create')" @click="create" />

        <template #append>
            <AppInfoIcon :player-id="player.playerId" />
        </template>
    </v-toolbar>
</template>

<script lang="ts" setup>
const player = usePlayer()

function create(): void {
    $fetch('/api/games', {
        method: 'POST',
        body: { playerId: player.value.playerId }
    })
        .then(res => { navigateTo(`/${res.gameId}`) })
        .catch(err => alert(err.message))
}
</script>