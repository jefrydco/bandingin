export const types = {
  SET_IMG: "SET_IMG",
  SET_IMG_LABEL: "SET_IMG_LABEL",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_SELECTED_PRODUCT: "SET_SELECTED_PRODUCT"
};

export const state = () => ({
  img: null,
  imgLabel: [],
  products: [],
  selectedProduct: null
});

export const getters = {};

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
  }
};

export const actions = {};
