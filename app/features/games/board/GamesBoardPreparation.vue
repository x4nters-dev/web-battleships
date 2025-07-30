<template>
    <div>
        <GamesBoardToolbar v-model="game" :ready-disabled="readyDisabled" @ready="ready" />
        <v-container>
            <v-row>
                <v-col>
                    <AppBoard v-if="board" v-model="board" @click="draw" />
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

const game = defineModel<Game>()
const player = usePlayer()
const playerReady = ref(false)
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

watchEffect(() => {
    if (player.value.playerId === game.value?.aBoard.playerId) {
        board.value = game.value.aBoard
    }

    if (player.value.playerId === game.value?.bBoard?.playerId) {
        board.value = game.value.bBoard
    }
})
</script>