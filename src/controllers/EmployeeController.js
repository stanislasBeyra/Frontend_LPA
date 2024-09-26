import { postResource, getResource, deleteResource } from "src/utils/configmethode"

const EmployeController = {
  getAllEmployee: (token) => getResource('api/get/employee/all', token),

}

export default EmployeController
