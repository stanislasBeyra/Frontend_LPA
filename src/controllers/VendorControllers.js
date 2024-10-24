import { postResource, getResource,deleteResource } from "src/utils/configmethode";

const VendorController = {
  addProduct: (data) => postResource("api/add/vendor/porduct", data),
  getProduct: (token) => getResource("api/get/vendor/products", token),
  updateProduct: (productId, data) => postResource(`api/update/vendor/products/${productId}`, data),
  deleteProduct:(productId,)=>deleteResource(`api/destroy/Product/${productId}`),
  getAllVendor: (token) => getResource('api/get/VendorList', token),
  getTheVendororders:(token)=>getResource('api/get/VendorOrders',token),
  validetedorder:(data)=>postResource('api/Vendor/validateOrder',data),
  getproductcategory:(token)=>getResource('api/get/category/foradmin',token)

};

export default VendorController;
