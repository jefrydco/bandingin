import LRUCache from "lru-cache";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/es5/util/colors";

Vue.use(Vuetify, {
  options: {
    minifyTheme: css =>
      process.env.NODE_ENV === "production"
        ? css.replace(/[\s|\r\n|\r|\n]/g, "")
        : css,
    themeCache: new LRUCache({
      max: 10,
      maxAge: 1000 * 60 * 60 // 1 hour
    }),
    cspNonce: "dQw4w9WgXcQ"
  },
  theme: {
    primary: colors.lightBlue,
    accent: colors.pink.accent1
  }
});
