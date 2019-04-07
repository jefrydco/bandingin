<template>
  <v-layout row="" wrap="">
    <v-flex xs12="">
      <v-layout row="" wrap="">
        <v-flex xs12="">
          <app-img :src="img" :aspect-ratio="3 / 4" alt="Choosen Image" />
        </v-flex>
      </v-layout>
      <v-layout row="" wrap="" align-center="" justify-space-around="">
        <v-btn icon="" large="" fab="" @click="onRetake">
          <v-icon x-large="">mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon="" large="" fab="" @click="onChoose">
          <v-icon x-large="">mdi-check-circle-outline</v-icon>
        </v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { types } from "~/store";

export default {
  data() {
    return {};
  },
  computed: {
    img: {
      get() {
        return this.$store.state.img;
      },
      set(img) {
        this.$store.commit(types.SET_IMG, img);
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.img === null) {
        this.$router.replace({ name: "index" });
      }
    },
    onRetake() {
      this.$router.replace({ name: "index" });
    },
    onChoose() {}
  }
};
</script>
