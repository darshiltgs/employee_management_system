import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createDepartment, deleteDepartment, getAllDepartments, getDepartmentById, updateDepartment } from "../controllers/department.controller.js";

const router = Router();

router.route("/").post(verifyToken, createDepartment);
router.route("/").get(verifyToken, getAllDepartments);
router.route("/:id").get(verifyToken, getDepartmentById);
router.route("/:id").put(verifyToken, updateDepartment);
router.route("/:id").delete(verifyToken, deleteDepartment);

export default router;