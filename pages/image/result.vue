<template>
  <app-container>
    <v-layout row="" wrap="">
      <template v-if="products.length > 0">
        <v-flex v-for="(product, i) in products" :key="`product_${i}`" xs6="">
          <v-card ripple="" @click="onCardClicked(product)">
            <v-img
              :src="product.image"
              :aspect-ratio="1"
              class="grey lighten-2"
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
            <v-responsive :aspect-ratio="1">
              <v-card-text>
                <h2 class="subheading" style="height: 100px">
                  {{ truncate(product.name, 30) }}
                </h2>
                <div>Rp. {{ product.price }}</div>
                <div>{{ product.source }}</div>
              </v-card-text>
            </v-responsive>
          </v-card>
        </v-flex>
      </template>
      <template v-if="products.length === 0 && !isLoading">
        <v-alert :value="true" color="primary">
          Maaf barang yang Anda cari tidak ditemukan di ecommerce manapun, mohon
          coba lagi dengan gambar atau kata kunci lain.
        </v-alert>
      </template>
      <template v-if="isLoading">
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
      <v-footer class="v-footer--custom" app="" fixed="" height="auto">
        <v-container fluid="" grid-list-xl="">
          <v-layout row="" wrap="">
            <v-flex xs12="">
              <v-text-field
                v-model="keyword"
                :disabled="isLoading"
                label="Kata Kunci"
                solo-inverted=""
                flat=""
                hide-details=""
                append-icon="search"
                @click:append="onSearch"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-footer>
      <v-dialog
        v-model="isFilterDialog"
        fullscreen=""
        hide-overlay=""
        transition="dialog-bottom-transition"
      >
        <template #activator="{ on }">
          <v-btn
            :disabled="isLoading"
            :loading="isLoading"
            class="v-btn--bottom--custom"
            fab=""
            fixed=""
            bottom=""
            right=""
            color="accent"
            v-on="on"
          >
            <v-icon>filter_list</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-toolbar dark="" card="" color="primary">
            <v-btn icon="" @click="isFilterDialog = false">
              <v-icon>chevron_left</v-icon>
            </v-btn>
            <v-toolbar-title>Filter</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container fluid="" grid-list-xl="">
              <v-layout row="" wrap="">
                <v-flex xs12="">
                  <v-text-field
                    v-model="keyword"
                    clearable=""
                    label="Kata Kunci"
                    solo-inverted=""
                    flat=""
                    hide-details=""
                    append-icon="search"
                    @click:append="onSearch"
                  />
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="">
                  <v-autocomplete
                    v-model="selectedCategory"
                    :items="categories"
                    clearable=""
                    item-text="name"
                    return-object=""
                    label="Kategori"
                    solo-inverted=""
                    flat=""
                    hide-details=""
                  />
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="">
                  <v-autocomplete
                    v-model="selectedSort"
                    :items="sortList"
                    clearable=""
                    label="Urutkan"
                    solo-inverted=""
                    flat=""
                    hide-details=""
                  />
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="" class="text-xs-center">
                  <v-btn color="primary" @click="onApplyFilter">Terapkan</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
  </app-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import qs from "qs";
import truncate from "truncate";
import uuid from "uuid/v4";
import { types } from "~/store";
import { db, Timestamp } from "~/helpers/firebase";

export default {
  data() {
    return {
      isLoading: false,
      sortList: [
        { text: "Termurah", value: "price:asc" },
        { text: "Termahal", value: "price:desc" }
      ],
      payload: null
    };
  },
  computed: {
    ...mapState(["categories", "user", "imgMeta"]),
    ...mapGetters(["isAuth"]),
    keyword: {
      get() {
        return this.$store.state.keyword;
      },
      set(keyword) {
        this.$store.commit(types.SET_KEYWORD, keyword);
      }
    },
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
    },
    selectedCategory: {
      get() {
        return this.$store.state.selectedCategory;
      },
      set(selectedCategory) {
        this.$store.commit(types.SET_SELECTED_CATEGORY, selectedCategory);
      }
    },
    isFilterDialog: {
      get() {
        return this.$store.state.isFilterDialog;
      },
      set(isFilterDialog) {
        this.$store.commit(types.SET_FILTER_DIALOG, isFilterDialog);
      }
    },
    selectedSort: {
      get() {
        return this.$store.state.selectedSort;
      },
      set(selectedSort) {
        this.$store.commit(types.SET_SELECTED_SORT, selectedSort);
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
          this.payload = {
            category: this.selectedCategory ? this.selectedCategory.value : "",
            keyword: kw.toLowerCase()
          };
          this.getProducts(this.payload);
          this.keyword = kw;
        }
      },
      immediate: true
    },
    imgMeta(meta) {
      if (meta) {
        const payload = {
          ...this.payload,
          ...meta,
          created_at: Timestamp.fromDate(new Date())
        };
        console.log(payload);
        this.createHistory(payload);
      }
    }
  },
  mounted() {
    this.products = [];
    this.init();
  },
  methods: {
    init() {
      console.log(this.selectedCategory);
      this.getProducts({
        category: this.selectedCategory ? this.selectedCategory.value : "",
        keyword: this.keyword
      });
    },
    truncate(string, maxLength) {
      if (!string) {
        return null;
      }
      string = string.toString();
      return truncate(string, maxLength);
    },
    async getProducts(payload) {
      try {
        this.isLoading = true;
        const queryString = qs.stringify(payload);
        const {
          data: { products = [] }
        } = await this.$http.$get(`bukalapak?${queryString}`);
        this.products = products;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async createHistory(payload) {
      try {
        this.isLoading = true;
        const historyRef = db
          .collection("users")
          .doc(this.user.uid)
          .collection("histories")
          .doc(uuid());

        await historyRef.set(payload, { merge: true });
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    onCardClicked(product) {
      this.selectedProduct = product;
      this.$router.push({ name: "image-iframe" });
    },
    onSearch() {
      this.products = [];
      this.getProducts({
        category: this.selectedCategory ? this.selectedCategory.value : "",
        keyword: this.keyword.toLowerCase(),
        sort_by: this.selectedSort
      });
      if (this.isAuth) {
        const payload = {
          category: this.selectedCategory ? this.selectedCategory.value : "",
          keyword: this.keyword ? this.keyword.toLowerCase() : "",
          fullPath: "",
          url: "",
          created_at: Timestamp.fromDate(new Date())
        };
        console.log(payload);
        this.createHistory(payload);
      }
    },
    onApplyFilter() {
      // https://www.bukalapak.com/products/?search%5Bassurance%5D=0&search%5Bbrand%5D=0&search%5Bcity%5D=&search%5Bfree_shipping_coverage%5D=&search%5Binstallment%5D=0&search%5Bkeyword%5D=headphones&search%5Bkeywords%5D=headphones&search%5Bnew%5D=1&search%5Bpremium_seller%5D=0&search%5Bprice_max%5D=&search%5Bprice_min%5D=&search%5Bprovince%5D=&search%5Brating_gte%5D=0&search%5Brating_lte%5D=5&search%5Bsort_by%5D=price%3Aasc&search%5Btodays_deal%5D=0&search%5Btop_seller%5D=0&search%5Bused%5D=1&search%5Bwholesale%5D=0&&
      this.isFilterDialog = false;
      this.onSearch();
    }
  }
};
</script>

<style>
.v-btn--bottom--custom:not(.v-btn--absolute) {
  bottom: 144px;
}
</style>
