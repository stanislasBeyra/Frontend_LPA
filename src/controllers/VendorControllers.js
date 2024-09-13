import { postResource, getResource } from "src/utils/configmethode";

const VendorController = {
  addProduct: (data) => postResource("api/add/vendor/porduct", data),
  getProduct: (token) => getResource("api/get/vendor/products", token),
  updateProduct: (productId, data) => postResource(`api/update/vendor/products/${productId}`, data),

};

export default VendorController;
