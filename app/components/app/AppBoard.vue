<template>
    <div>
        <div v-if="board">
            <div v-for="(row, rowIndex) of board.cells" :key="rowIndex" class="d-flex">
                <div v-for="(cell, columnIndex) of row" :key="columnIndex" class="border pa-4" :class="{
                    'bg-red': cell.status === CellStatus.hit,
                    'bg-blue': !props.enemy && cell.status === CellStatus.filled,
                    'bg-grey': cell.status === CellStatus.missed,
                    'cursor-pointer': !props.disabled
                }" @click="click(cell)" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Board, Cell } from '#imports';
import { CellStatus } from '~~/shared/enums/cellStatus';

const props = defineProps<{
    disabled?: boolean
    enemy?: boolean
}>()

const board = defineModel<Board>()

const emit = defineEmits<{
    (e: 'click', payload: Cell): void
}>()

function click(cell: Cell): void {
    if (props.disabled) return
    if ([CellStatus.hit, CellStatus.missed].includes(cell.status)) return

    emit('click', cell)
}
</script>