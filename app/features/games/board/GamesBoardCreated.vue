<template>
    <div>
        <GamesBoardToolbar />
        <v-container>
            <v-row>
                <v-col class="d-flex flex-column align-center justify-center ga-4">
                    <v-progress-circular indeterminate />
                    <p>{{ $t('waitingForEnemyToJoin') }}</p>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { EventType } from '~~/shared/enums/events';
import { GameStatus } from '~~/shared/enums/gameStatus';

const props = defineProps<{
    gameId: string
}>()

const emit = defineEmits<{
    (e: 'refreshGame'): void
}>()

const sseEventsStore = useSseEventsStore()

function onJoined(): void {
    emit('refreshGame')
}

function onUpdated(payload: UpdatedEvent): void {
    if (payload.status === GameStatus.canceled) {
        $fetch(`/api/games/${props.gameId}/leave`).finally(() => {
            emit('refreshGame')
            alert($t('gameCanceled'))
            navigateTo('/')
        })
    }
}

watchEffect(() => {
    if (!sseEventsStore.lastEvent) return

    const { eventType, payload } = sseEventsStore.lastEvent

    switch (eventType) {
        case EventType.joined:
            onJoined()
            break
        case EventType.updated:
            onUpdated(payload as UpdatedEvent)
            break
    }

    sseEventsStore.clearLastEvent()
})
</script>