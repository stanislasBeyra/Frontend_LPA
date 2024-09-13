import { postResource, getResource } from "src/utils/configmethode";

const LoginController = {
  register: (data) => postResource("api/register", data),
  login: (data) => postResource("api/login", data),
  getProfile: (token) => getResource("api/user/info", token),
  deletuser:(token)=>postResource('hghdd',token)
};

export default LoginController;
