<template>
    <div>
        <GamesBoardToolbar v-model="game" :ready-disabled="readyDisabled" :enemy-ready="enemyReady" @ready="ready" />
        <v-container>
            <v-row>
                <v-col>
                    <AppBoard v-if="board" v-model="board" :disabled="playerReady" @click="draw" />
                </v-col>
                <v-col>
                    <GamesBoardFleet :fleet="fleet" />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { CellStatus } from '~~/shared/enums/cellStatus'
import { EventType } from '~~/shared/enums/events'
import { GameStatus } from '~~/shared/enums/gameStatus'

const player = usePlayer()
const sseEventsStore = useSseEventsStore()
const gamesApi = useGamesApi()

const game = defineModel<Game | null>()

const emit = defineEmits<{
    (e: 'refreshGame'): void
}>()

const playerReady = ref(false)
const enemyReady = ref(false)
const board = ref<Board>()
const fleet = ref<Fleet | null>(null)

const readyDisabled = computed(() => {
    const filled = board.value?.cells.flat().filter(c => c.status === CellStatus.filled).length ?? 0

    return Boolean(filled < 20 || playerReady.value)
})

function draw(cell: Cell): void {
    if (!board.value) {
        return
    }

    const validatedFleet = validateBoard(board.value, cell)
    if (!validatedFleet) {
        return
    }

    fleet.value = validatedFleet

    switch (cell.status) {
        case CellStatus.empty:
            cell.status = CellStatus.filled
            break
        case CellStatus.filled:
            cell.status = CellStatus.empty
            break
        case CellStatus.hit:
        case CellStatus.missed:
            throw Error('invalid cell state')
    }
}

function ready(): void {
    playerReady.value = true

    $fetch(`/api/games/${game.value?.gameId}/ready`, {
        method: 'POST',
        body: { playerId: player.value.playerId, cells: board.value?.cells }
    })
}

function onReady(payload: ReadyEvent): void {
    if (player.value.playerId !== payload.playerId) {
        enemyReady.value = true
    }
}

function onStarted(): void {
    emit('refreshGame')
}

function onUpdated(payload: UpdatedEvent): void {
    if (payload.status === GameStatus.canceled) {
        $fetch(`/api/games/${game.value?.gameId}/leave`).finally(() => {
            gamesApi.refresh()
            alert($t('gameCanceled'))
            navigateTo('/')
        })
    }
}

watchEffect(() => {
    if (player.value.playerId === game.value?.aBoard.playerId) {
        board.value = game.value.aBoard
    }

    if (player.value.playerId === game.value?.bBoard?.playerId) {
        board.value = game.value.bBoard
    }
})

watchEffect(() => {
    if (!sseEventsStore.lastEvent) return

    const { eventType, payload } = sseEventsStore.lastEvent

    switch (eventType) {
        case EventType.ready:
            onReady(payload as ReadyEvent)
            break
        case EventType.started:
            onStarted()
            break
        case EventType.updated:
            onUpdated(payload as UpdatedEvent)
            break
    }

    sseEventsStore.clearLastEvent()
})
</script>