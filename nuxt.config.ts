import { md3 } from 'vuetify/blueprints'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', 'vuetify-nuxt-module', '@nuxtjs/i18n'],
  routeRules: {
    '/:gameId/**': { ssr: false},
    '/**': { ssr: false },
  },
  components: {
    dirs: [
      {path: 'components'},
      {path: 'features'}
    ]
  },
  imports: {
    dirs: ['types', 'enums']
  },
  vuetify: {
    vuetifyOptions: {
      blueprint: md3,
      defaults: {
        VBtn: {
          style: 'text-transform: none;'
        },
        VCard: {
          elevation: '0'
        }
      },
      theme: {
        defaultTheme: 'system'
      }
    },
  },
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'pl', name: 'Polski', file: 'pl.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'en'
    }
  }
})