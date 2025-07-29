<template>
    <GamesBoard :game-id="gameId" />
</template>

<script lang="ts" setup>
const route = useRoute()
const gameId = computed(() => route.params.gameId as string)
</script>