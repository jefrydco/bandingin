<template>
  <v-app>
    <v-toolbar
      fixed=""
      app=""
      dark=""
      color="primary"
      class="v-toolbar--custom-width"
    >
      <v-btn v-if="$route.name !== 'index'" icon="" @click="$router.go(-1)">
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <v-toolbar-title
        style="cursor: pointer"
        @click="$router.push({ name: 'index' })"
      >
        Banding Harga
      </v-toolbar-title>
      <v-spacer />
      <v-btn v-if="isAuth" icon="" @click="onLogout">
        <v-icon>logout</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
    <v-bottom-nav
      :active.sync="activeMenu"
      :value="true"
      class="v-bottom-nav--custom"
      dark=""
      app=""
      fixed=""
      color="primary"
    >
      <v-btn
        v-for="(menu, i) in menus"
        :key="`bottom_nav_item_${i}`"
        :to="menu.to"
        nuxt=""
        exact=""
      >
        <span>{{ menu.text }}</span>
        <v-icon>{{ menu.icon }}</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import { types } from "~/store";
import { auth } from "~/helpers/firebase";

export default {
  data() {
    return {
      activeMenu: null,
      menus: [
        { text: "Scan", icon: "camera", to: { name: "index" } },
        { text: "Account", icon: "account_circle", to: { name: "account" } }
      ]
    };
  },
  computed: {
    ...mapGetters(["isAuth"])
  },
  mounted() {
    this.onAuthStateChanged();
    document.addEventListener("touchmove", this.preventScale, false);
  },
  beforeDestroy() {
    document.removeEventListener("touchcancel", this.preventScale);
  },
  methods: {
    preventScale(event) {
      event = event.originalEvent || event;
      if (event.scale > 1) {
        event.preventDefault();
      }
    },
    onAuthStateChanged() {
      auth.onAuthStateChanged(user => {
        if (user !== null) {
          const payload = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          };
          this.$store.commit(types.SET_USER, payload);
        }
      });
    },
    async onLogout() {
      await auth.signOut();
      await this.$store.commit(types.SET_USER, null);
    }
  }
};
</script>

<style>
@media (min-width: 1904px) {
  .v-toolbar--custom-width,
  .v-bottom-nav--custom,
  .v-footer--custom,
  .v-dialog--fullscreen,
  .v-bottom-sheet {
    max-width: 25%;
    margin-left: 37.5%;
  }
}
@media (min-width: 1264px) {
  .v-toolbar--custom-width,
  .v-bottom-nav--custom,
  .v-footer--custom,
  .v-dialog--fullscreen,
  .v-bottom-sheet {
    max-width: 33.33333333333333%;
    margin-left: 33.33333333333333%;
  }
}
/* @media (min-width: 960px) and (max-width: 1903px) {
  .v-toolbar--custom-width {
    max-width: 50%;
    margin-left: 25%;
  }
  .v-bottom-nav--custom,
  .v-footer--custom,
  .v-dialog--fullscreen {
    max-width: 50%;
    margin-left: 25%;
  }
  .v-bottom-sheet {
    min-width: 66.66666666666666% !important;
    max-width: 50%;
  }
} */
@media (max-width: 960px) {
  .v-toolbar--custom-width,
  .v-bottom-nav--custom,
  .v-footer--custom,
  .v-dialog--fullscreen,
  .v-bottom-sheet {
    max-width: 66.66666666666666%;
    margin-left: 16.6666666666666%;
  }
}
@media (max-width: 600px) {
  .v-toolbar--custom-width,
  .v-bottom-nav--custom,
  .v-footer--custom,
  .v-dialog--fullscreen,
  .v-bottom-sheet {
    max-width: 100%;
    margin-left: 0%;
  }
}
</style>
