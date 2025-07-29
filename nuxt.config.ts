import { md3 } from 'vuetify/blueprints'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', 'vuetify-nuxt-module', '@nuxtjs/i18n'],
  routeRules: {
    '/:gameId/**': { ssr: false},
  },
  components: {
    dirs: [
      {path: 'components'},
      {path: 'features'}
    ]
  },
  imports: {
    dirs: ['types']
  },
  vuetify: {
    vuetifyOptions: {
      blueprint: md3,
      defaults: {
        VBtn: {
          style: 'text-transform: none;'
        }
      }
    },
  },
  i18n: {
    locales: [
      {code: 'en', name: 'English', file: 'en.json'}
    ]
  }
})