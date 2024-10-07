import { Router } from "express";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, getEmployeesByDepartment, updateEmployee } from "../controllers/employee.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.route("/").post(createEmployee);
router.route("/").get(getAllEmployees);
router.route("/:id").get(getEmployeeById);
router.route("/:id").put(updateEmployee);
router.route("/:id").delete(deleteEmployee);
router.route("/department/:id").get(getEmployeesByDepartment);

export default router;