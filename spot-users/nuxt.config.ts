// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
        link: [
            { rel: 'stylesheet', href: 'https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css'},
            { rel: 'stylesheet', href: 'https://cdn-uicons.flaticon.com/2.0.0/uicons-bold-rounded/css/uicons-bold-rounded.css'},
            { rel: 'preconnect', href: 'https://fonts.googleapis.com'},
            { rel: 'preconnect', href: 'https://fonts.gstatic.com'},
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500&display=swap'},
        ]
    }
  
  },
  modules: ['@nuxtjs/tailwindcss'],
})
