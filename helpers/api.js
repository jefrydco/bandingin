import { stringify } from "qs";

export default $http => resource => ({
  store(payload) {
    return $http.$post(`/${resource}/`, payload);
  },
  show(id, params = {}) {
    return $http.$get(`/${resource}/${id}/?${stringify(params)}`);
  },
  index(params = {}) {
    return $http.$get(`/${resource}/?${stringify(params)}`);
  },
  update(id, payload) {
    return $http.$put(`/${resource}/${id}/`, payload);
  },
  delete(id) {
    return $http.$delete(`/${resource}/${id}`);
  }
});
