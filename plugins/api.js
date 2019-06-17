import createRepo from "~/helpers/api";

export default ({ $http }, inject) => {
  const createApi = createRepo($http);

  const apiList = {
    products: createApi("products")
  };

  inject("api", apiList);
};
