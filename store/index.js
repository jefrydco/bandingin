export const types = {
  SET_IMG: "SET_IMG"
};

export const state = () => ({
  img: null
});

export const getters = {};

export const mutations = {
  [types.SET_IMG](state, payload) {
    state.img = payload;
  }
};

export const actions = {};
