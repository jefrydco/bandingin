export const types = {
  SET_IMG: "SET_IMG",
  SET_IMG_LABEL: "SET_IMG_LABEL",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_SELECTED_PRODUCT: "SET_SELECTED_PRODUCT",
  SET_USER: "SET_USER",
  SET_CATEGORIES: "SET_CATEGORIES",
  SET_SELECTED_CATEGORY: "SET_SELECTED_CATEGORY",
  SET_FILTER_DIALOG: "SET_FILTER_DIALOG",
  SET_SELECTED_SORT: "SET_SELECTED_SORT"
};

export const state = () => ({
  img: null,
  imgLabel: [],
  products: [],
  selectedProduct: null,
  user: null,
  categories: [],
  selectedCategory: null,
  isFilterDialog: false,
  selectedSort: null
});

export const getters = {
  isAuth(state) {
    return state.user !== null;
  }
};

export const mutations = {
  [types.SET_IMG](state, payload) {
    state.img = payload;
  },
  [types.SET_IMG_LABEL](state, payload) {
    state.imgLabel = payload;
  },
  [types.SET_PRODUCTS](state, payload) {
    state.products = payload;
  },
  [types.SET_SELECTED_PRODUCT](state, payload) {
    state.selectedProduct = payload;
  },
  [types.SET_USER](state, payload) {
    state.user = payload;
  },
  [types.SET_CATEGORIES](state, payload) {
    state.categories = payload;
  },
  [types.SET_SELECTED_CATEGORY](state, payload) {
    state.selectedCategory = payload;
  },
  [types.SET_FILTER_DIALOG](state, payload) {
    state.isFilterDialog = payload;
  },
  [types.SET_SELECTED_SORT](state, payload) {
    state.selectedSort = payload;
  }
};

export const actions = {
  async nuxtServerInit({ commit }, { $http }) {
    const {
      data: { categories = [] }
    } = await $http.$get("bukalapak/category");
    commit(types.SET_CATEGORIES, categories);
  }
};
