<template>
  <app-container :fill-height="!isAuth">
    <div v-if="user !== null">
      <v-card>
        <v-card-text class="text-xs-center">
          <v-avatar size="70">
            <v-img :src="user.photoURL">
              <template #placeholder="">
                <v-layout
                  fill-height=""
                  align-center=""
                  justify-center=""
                  ma-0=""
                >
                  <v-progress-circular
                    indeterminate=""
                    color="grey lighten-5"
                  />
                </v-layout>
              </template>
            </v-img>
          </v-avatar>
          <h2 class="subheading mt-3">{{ user.displayName }}</h2>
        </v-card-text>
      </v-card>
      <h2 class="headline mt-3 mb-2">Riwayat Pencarian</h2>
      <v-divider />
    </div>
    <v-card v-else="">
      <v-card-text>
        <h2 class="headline mb-3">
          Silahkan login untuk menyimpan hasil pencarian kamu
        </h2>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="onLogin">
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </app-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { GoogleAuthProvider, auth } from "~/helpers/firebase";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["user"]),
    ...mapGetters(["isAuth"])
  },
  methods: {
    onLogin() {
      auth.signInWithRedirect(GoogleAuthProvider);
    }
  }
};
</script>
