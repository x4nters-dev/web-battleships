<template>
    <v-menu>
        <template #activator="{ props }">
            <v-btn icon v-bind="props">
                <v-icon>mdi-earth</v-icon>
            </v-btn>
        </template>

        <v-list>
            <v-list-item v-for="lang of availableLocales" :key="lang" :active="locale === lang"
                @click="setLocale(lang)">
                <v-list-item-title>{{ $t(`locale.${lang}`) }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script lang="ts" setup>
const { availableLocales, locale, setLocale } = useI18n()
</script>
