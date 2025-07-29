<template>
    <div>
        <GamesBoardToolbar v-model="game" :current-side="currentSide" :player-side="playerSide" />
        <v-container>
            <v-row>
                <v-col>
                    <AppBoard v-if="playerBoard" v-model="playerBoard" disabled />
                </v-col>
                <v-col>
                    <AppBoard v-if="enemyBoard" v-model="enemyBoard" :disabled="currentSide !== playerSide" enemy
                        @click="shot" />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>


<script lang="ts" setup>
import { CellStatus } from '~~/shared/enums/cellStatus'
import { ShotStatus } from '~~/shared/enums/shotStatus'

const player = usePlayer()
const game = defineModel<Game>()

const playerBoard = ref<Board>()
const enemyBoard = ref<Board | null>()

const currentSide = ref<'a' | 'b'>('a')
const playerSide = ref<'a' | 'b'>()
const enemySide = ref<'a' | 'b'>()

const shotEvent = useShotEvent()
const finishedEvent = useFinishedEvent()

function shot(cell: Cell): void {
    $fetch(`/api/games/${game.value?.gameId}/shot`, {
        method: 'POST',
        body: {
            attackerId: player.value.playerId,
            targetId: enemyBoard.value?.playerId,
            x: cell.x,
            y: cell.y
        }
    })
}

watchEffect(() => {
    if (player.value.playerId === game.value?.aBoard.playerId) {
        playerBoard.value = game.value.aBoard
        enemyBoard.value = game.value.bBoard
        playerSide.value = 'a'
        enemySide.value = 'b'
    }

    if (player.value.playerId === game.value?.bBoard?.playerId) {
        playerBoard.value = game.value.bBoard
        enemyBoard.value = game.value.aBoard
        playerSide.value = 'b'
        enemySide.value = 'a'
    }
})

watchEffect(() => {
    if (!shotEvent.value) return

    const { x, y } = shotEvent.value

    let cell: Cell;

    switch (shotEvent.value.targetId) {
        case playerBoard.value?.playerId:
            cell = playerBoard!.value!.cells![x]![y]!
            currentSide.value = playerSide.value!
            break
        case enemyBoard.value?.playerId:
            cell = enemyBoard.value!.cells![x]![y]!
            currentSide.value = enemySide.value!
            break
        default:
            throw Error('invalid player')
    }

    switch (shotEvent.value.status) {
        case ShotStatus.hit:
            cell.status = CellStatus.hit
            break
        case ShotStatus.missed:
            cell.status = CellStatus.missed
            break
        default:
            throw Error('invalid shot status')
    }
})

watchEffect(() => {
    if (!finishedEvent.value) return

    if (finishedEvent.value.winnerId === playerBoard.value?.playerId) {
        alert($t('youWon'))
    }

    if (finishedEvent.value.winnerId === enemyBoard.value?.playerId) {
        alert($t('enemyWon'))
    }

    navigateTo('/')
})
</script>