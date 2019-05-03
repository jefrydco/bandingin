import nodeExternals from "webpack-node-externals";
import VuetifyLoaderPlugin from "vuetify-loader/lib/plugin";
require("dotenv").config();

const isDev = process.env.NODE_ENV !== "production";

export default {
  // https://nuxtjs.org/api/configuration-modern
  modern: !isDev,

  // https://nuxtjs.org/api/configuration-head
  head: {
    titleTemplate(title) {
      if (title) {
        return `${title} - Bandingin`;
      }
      return "Bandingin";
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ]
  },

  // https://nuxtjs.org/api/configuration-modules
  modules: [
    // https://axios.nuxtjs.org/
    "@nuxtjs/axios",

    // https://nuxtjs.org/faq/cached-components/
    "@nuxtjs/component-cache",

    // https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",

    // https://pwa.nuxtjs.org/
    "@nuxtjs/pwa",

    // https://github.com/nuxt-community/sitemap-module
    "@nuxtjs/sitemap",

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
    name: "Bandingin",
    description:
      "Bandingin aggregates products from different e-commerce and compare its price",
    theme_color: "#90CAF9"
  },

  manifest: {
    name: "Bandingin",
    short_name: "Bandingin",
    start_url: "/?utm_source=homescreen",
    description:
      "Bandingin aggregates products from different e-commerce and compare its price",
    lang: "id",
    theme_color: "#90CAF9",
    background_color: "#fff"
  },

  axios: {
    proxy: true
  },

  proxy: {
    "/api/": "http://localhost:3000/api"
  },

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
  css: ["@mdi/font/css/materialdesignicons.css", "~/assets/styles/vuetify"],

  // https://nuxtjs.org/api/configuration-watch
  watch: ["~/server/**/*.js", "~/mixins/**/*.js"],

  serverMiddleware: ["~/server/index"],

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
