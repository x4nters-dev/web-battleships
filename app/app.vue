<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script lang="ts" setup>
const store = useSseEventsStore()

onMounted(() => {
  store.connect(usePlayer().value.playerId)
})
</script>