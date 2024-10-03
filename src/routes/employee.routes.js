import { Router } from "express";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, getEmployeesByDepartment, updateEmployee } from "../controllers/employee.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyToken, createEmployee);
router.route("/").get(verifyToken, getAllEmployees);
router.route("/:id").get(verifyToken, getEmployeeById);
router.route("/:id").put(verifyToken, updateEmployee);
router.route("/:id").delete(verifyToken, deleteEmployee);
router.route("/department/:id").get(verifyToken, getEmployeesByDepartment);

export default router;