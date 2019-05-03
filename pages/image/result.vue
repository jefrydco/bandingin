<template>
  <v-layout row="" wrap="">
    <template v-if="products.length > 0">
      <v-flex v-for="(product, i) in products" :key="`product_${i}`" xs6="">
        <v-card ripple="" @click="onCardClicked(product)">
          <v-img :src="product.image" :aspect-ratio="1" class="grey lighten-2">
            <template #placeholder="">
              <v-layout
                fill-height=""
                align-center=""
                justify-center=""
                ma-0=""
              >
                <v-progress-circular indeterminate="" color="grey lighten-5" />
              </v-layout>
            </template>
          </v-img>
          <v-responsive :aspect-ratio="3 / 4">
            <v-card-text>
              <div class="mb-3">{{ product.name }}</div>
              <div>Rp. {{ product.price }}</div>
            </v-card-text>
          </v-responsive>
        </v-card>
        <!-- <ol>
        <li v-for="(label, i) in imgLabel" :key="`label_${label.mid}_${i}`">
          {{ label.translations[0].translatedText }} - {{ label.score }}
        </li>
      </ol> -->
      </v-flex>
    </template>
    <template v-else="">
      <v-layout
        class="mt-3"
        fill-height=""
        align-center=""
        justify-center=""
        ma-0=""
      >
        <v-progress-circular indeterminate="" color="primary" />
      </v-layout>
    </template>
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
    },
    products: {
      get() {
        return this.$store.state.products;
      },
      set(products) {
        this.$store.commit(types.SET_PRODUCTS, products);
      }
    },
    selectedProduct: {
      get() {
        return this.$store.state.selectedProduct;
      },
      set(selectedProduct) {
        this.$store.commit(types.SET_SELECTED_PRODUCT, selectedProduct);
      }
    }
  },
  watch: {
    imgLabel: {
      handler(imgLabel) {
        if (imgLabel.length > 0) {
          // eslint-disable-next-line
          const [keyword, ...rest] = imgLabel;
          this.getProducts(keyword.translations[0].translatedText);
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.products = [];
  },
  methods: {
    async getProducts(keyword) {
      const { data } = await this.$axios.$get(
        `/api/bukalapak?keyword=${keyword}`
      );
      this.products = await data.products.map(product => ({
        ...product,
        link: `https://www.bukalapak.com${product.link}`
      }));
    },
    onCardClicked(product) {
      this.selectedProduct = product;
      this.$router.push({ name: "image-iframe" });
    }
  }
};
</script>
