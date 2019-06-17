import nodeExternals from "webpack-node-externals";
import VuetifyLoaderPlugin from "vuetify-loader/lib/plugin";

const isDev = process.env.NODE_ENV !== "production";

export default {
  // https://nuxtjs.org/api/configuration-modern
  modern: !isDev,

  // https://nuxtjs.org/api/configuration-head
  head: {
    titleTemplate(title) {
      if (title) {
        return `${title} - Banding Harga`;
      }
      return "Banding Harga";
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ]
  },

  // https://nuxtjs.org/api/configuration-modules
  modules: [
    // https://http.nuxtjs.org/
    "@nuxt/http",

    // https://pwa.nuxtjs.org/
    "@nuxtjs/pwa",

    // https://github.com/nuxt-community/moment-module
    "@nuxtjs/moment",

    // https://github.com/nuxt-community/sentry-module
    // "@nuxtjs/sentry",

    // https://github.com/Developmint/nuxt-webfontloader
    "nuxt-webfontloader"

    // https://github.com/nuxt-community/analytics-module
    // [
    //   "@nuxtjs/google-analytics",
    //   {
    //     // TODO: Change this id to your Google Analytics ID
    //     id: process.env.GOOGLE_ANALYTICS
    //   }
    // ],
  ],

  meta: {
    name: "Banding Harga",
    description:
      "Banding Harga aggregates products from different e-commerce and compare its price",
    theme_color: "#90CAF9"
  },

  manifest: {
    name: "Banding Harga",
    short_name: "Banding Harga",
    start_url: "/?utm_source=homescreen",
    description:
      "Banding Harga aggregates products from different e-commerce and compare its price",
    lang: "id",
    theme_color: "#90CAF9",
    background_color: "#fff"
  },

  http: {
    // proxy: true
    baseURL: "http://localhost:3001/api"
  },

  // proxy: {
  //   "/api/": "http://localhost:3001/api"
  // },

  webfontloader: {
    google: {
      families: ["Roboto:100,300,400,500,700,900", "Material+Icons"]
    }
  },

  // https://nuxtjs.org/api/configuration-plugins
  plugins: [
    "~/plugins/api",
    "~/plugins/components",
    "~/plugins/vuetify",
    "~/plugins/vee-validate",
    "~/plugins/components.client"
  ],

  // https://nuxtjs.org/api/configuration-css
  css: ["~/assets/styles/vuetify"],

  // https://nuxtjs.org/api/configuration-watch
  watch: ["~/mixins/**/*.js"],

  // serverMiddleware: ["~/api/index"],

  // https://nuxtjs.org/api/configuration-build
  build: {
    extractCSS: !isDev,
    transpile: [/^vuetify/],
    plugins: [new VuetifyLoaderPlugin()],
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/,
          options: {
            fix: true
          }
        });
      }
      if (process.server) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ];
      }
    }
  }
};
