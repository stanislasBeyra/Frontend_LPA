import { postResource, getResource } from "src/utils/configmethode";

const LoginController = {
  register: (data) => postResource("api/register", data),
  submitRegister:(data)=>postResource('api/submit/register',data),
  getrole:(token)=>getResource("api/get/allrole",token),
  login: (data) => postResource("api/login", data),
  getProfile: (token) => getResource("api/user/info", token),
  deletuser:(token)=>postResource('hghdd',token)

};

export default LoginController;
