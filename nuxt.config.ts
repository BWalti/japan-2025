import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
      '@nuxt/content',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    'nuxt-maplibre'],

  runtimeConfig: {
    public: {
      weatherApiKey: 'f0aac73bbe63716305955fcb468aac77', // hier leer lassen, füllst du über .env
      appUrl: 'https://jp25.bwalti.net'
    }
  },

  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/rss.xml"],
    },
  },

  css: ['assets/css/main.css'],
  colorMode: { classSuffix: '' },

  components: true,
  content: {
    build: {
      markdown: {
        highlight: {
          // See the available themes on https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-theme
          theme: {
            dark: 'github-dark',
            default: 'github-light',
          },
        },
      },
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-02-19',

  vite: { plugins: [tailwindcss()] },
})