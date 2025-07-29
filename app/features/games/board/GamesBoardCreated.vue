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