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
    <v-footer app="" fixed="" height="auto">
      <v-container fluid="" grid-list-xl="">
        <v-layout row="" wrap="">
          <v-flex xs12="">
            <v-text-field
              v-model="keyword"
              label="Kata Kunci"
              solo-inverted=""
              flat=""
              hide-details=""
              append-icon="mdi-magnify"
              @click:append="onSearch"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-footer>
  </v-layout>
</template>

<script>
import { types } from "~/store";

export default {
  data() {
    return {
      keyword: ""
    };
  },
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
          const [keyword, secondKeyword, ...rest] = imgLabel;
          const kw = `${keyword.description} & ${secondKeyword.description}`;
          this.getProducts(kw);
          // this.getProducts(keyword.translations[0].translatedText);
          this.keyword = kw;
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
    },
    onSearch() {
      this.products = [];
      this.getProducts(this.keyword);
    }
  }
};
</script>
