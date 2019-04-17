export const types = {
  SET_IMG: "SET_IMG",
  SET_IMG_LABEL: "SET_IMG_LABEL"
};

export const state = () => ({
  img: null,
  imgLabel: null
});

export const getters = {};

export const mutations = {
  [types.SET_IMG](state, payload) {
    state.img = payload;
  },
  [types.SET_IMG_LABEL](state, payload) {
    state.imgLabel = payload;
  }
};

export const actions = {};
