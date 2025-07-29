<template>
    <v-app-bar>
        <template #title>
            <v-btn :text="$t('appName')" to="/" :active="false" />
        </template>
        <template #append>
            <AppLanguageMenu />
        </template>
    </v-app-bar>
</template>