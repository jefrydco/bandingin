<template>
  <app-container fill-height="">
    <v-layout row="" wrap="" fill-height="">
      <v-flex xs12="" fill-height="">
        <vue-friendly-iframe
          v-if="selectedProduct !== null"
          :src="selectedProduct.link"
        />
      </v-flex>
    </v-layout>
  </app-container>
</template>

<script>
import { types } from "~/store";
import VueFriendlyIframe from "vue-friendly-iframe";

export default {
  components: {
    VueFriendlyIframe
  },
  computed: {
    selectedProduct: {
      get() {
        return this.$store.state.selectedProduct;
      },
      set(selectedProduct) {
        this.$store.commit(types.SET_SELECTED_PRODUCT, selectedProduct);
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.selectedProduct === null) {
        this.$router.replace({ name: "index" });
      }
    }
  }
};
</script>

<style>
.vue-friendly-iframe > iframe {
  width: 50vh;
  height: 85vh;
}
</style>
