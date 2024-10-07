import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from "../controllers/department.controller.js";

const router = Router();

router.use(verifyToken);

router.route("/").post(createDepartment);
router.route("/").get(getAllDepartments);
router.route("/:id").get(getDepartmentById);
router.route("/:id").put(updateDepartment);
router.route("/:id").delete(deleteDepartment);

export default router;
