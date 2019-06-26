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
      <v-card class="mt-3">
        <v-card-text>
          <h2 class="headline mt-3 mb-2">Riwayat Pencarian</h2>
          <v-btn color="primary" @click="getHistories(false)">
            Tampilkan Semua Riwayat
          </v-btn>
          <div>
            <v-progress-circular
              v-if="isLoadingHistory"
              indeterminate=""
              color="primary"
              class="mt-3"
            />
            <v-list v-else="" three-line="">
              <v-list-tile
                v-for="history in histories"
                :key="history.id"
                ripple=""
                @click="onHistoryClicked(history)"
              >
                <v-list-tile-avatar
                  :color="history.url.length > 0 ? '' : 'primary'"
                >
                  <v-img
                    v-if="history.url.length > 0"
                    :src="history.url"
                    :alt="history.id"
                  >
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
                  <v-icon v-else="" class="white--text">image</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ titleize(history.keyword) }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <div>
                      {{
                        getCategory(history.category)
                          ? getCategory(history.category).name
                          : "No Category"
                      }}
                    </div>
                    <time :time="history.created_at.toDate()">{{
                      $moment(history.created_at.toDate()).format("LLLL")
                    }}</time>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </div>
        </v-card-text>
      </v-card>
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
import titleize from "titleize";
import { mapState, mapGetters } from "vuex";
import { types } from "~/store";
import { GoogleAuthProvider, auth, db } from "~/helpers/firebase";

export default {
  data() {
    return {
      isLoadingHistory: false
    };
  },
  computed: {
    ...mapState(["user", "histories", "categories"]),
    ...mapGetters(["isAuth"])
  },
  watch: {
    isAuth(isAuth) {
      if (isAuth) {
        this.getHistories();
      }
    }
  },
  mounted() {
    if (this.isAuth) {
      this.getHistories();
    }
  },
  methods: {
    titleize(string) {
      if (!string) {
        return;
      }
      string = string.toString();
      return titleize(string);
    },
    getCategory(_category) {
      return this.categories.find(category => category.value === _category);
    },
    onLogin() {
      auth.signInWithRedirect(GoogleAuthProvider);
    },
    onHistoryClicked({ keyword, category }) {
      this.$store.commit(types.SET_KEYWORD, titleize(keyword));
      this.$store.commit(
        types.SET_SELECTED_CATEGORY,
        this.getCategory(category)
      );
      this.$router.push({ name: "image-result" });
    },
    async getHistories(isLimited = true) {
      const histories = [];
      const historiesRef = db
        .collection("users")
        .doc(this.user.uid)
        .collection("histories");
      try {
        this.isLoadingHistory = true;
        if (isLimited) {
          const querySnapshot = await historiesRef
            .orderBy("created_at", "desc")
            .limit(10)
            .get();
          await querySnapshot.forEach(doc => {
            histories.push({
              id: doc.id,
              ...doc.data()
            });
          });
          await console.log(histories);
          await this.$store.commit(types.SET_HISTORIES, histories);
        } else {
          const querySnapshot = await historiesRef
            .orderBy("created_at", "desc")
            .get();
          await querySnapshot.forEach(doc => {
            histories.push({
              id: doc.id,
              ...doc.data()
            });
          });
          await console.log(histories);
          await this.$store.commit(types.SET_HISTORIES, histories);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoadingHistory = false;
      }
    }
  }
};
</script>
