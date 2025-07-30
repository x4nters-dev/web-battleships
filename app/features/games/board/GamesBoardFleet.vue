<template>
    <div>
        <p :class="{ 'text-green': props.fleet?.[4] === 1 }">{{ battleshipsLabel }}</p>
        <p :class="{ 'text-green': props.fleet?.[3] === 2 }">{{ cruisersLabel }}</p>
        <p :class="{ 'text-green': props.fleet?.[2] === 3 }">{{ destroyersLabel }}</p>
        <p :class="{ 'text-green': props.fleet?.[1] === 4 }">{{ submarinesLabel }}</p>
    </div>
</template>

<script lang="ts" setup>
import type { Fleet } from '~~/shared/types/fleet';

const props = defineProps<{
    fleet: Fleet | null
}>()

const battleshipsLabel = computed(() => `${$t('battleships')} [4]: ${props.fleet?.[4] ?? 0}/1`)
const cruisersLabel = computed(() => `${$t('cruisers')} [3]: ${props.fleet?.[3] ?? 0}/2`)
const destroyersLabel = computed(() => `${$t('destroyers')} [2]: ${props.fleet?.[2] ?? 0}/3`)
const submarinesLabel = computed(() => `${$t('submarines')} [1]: ${props.fleet?.[1] ?? 0}/4`)
</script>