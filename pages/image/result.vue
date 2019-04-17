<template>
  <v-layout row="" wrap="">
    <v-flex xs12="">
      <ol>
        <li v-for="(label, i) in imgLabel" :key="`label_${label.mid}_${i}`">
          {{ label.description }} - {{ label.score }}
        </li>
      </ol>
    </v-flex>
  </v-layout>
</template>

<script>
import { types } from "~/store";

export default {
  computed: {
    imgLabel: {
      get() {
        return this.$store.state.imgLabel;
      },
      set(imgLabel) {
        this.$store.commit(types.SET_IMG_LABEL, imgLabel);
      }
    }
  }
};
</script>
