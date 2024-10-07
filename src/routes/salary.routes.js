import { Router } from "express";
import { createSalary, deleteSalary, getAllSalaries, getSalariesByEmployee, getSalaryById, updateSalary } from "../controllers/salary.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.route("/").post(createSalary);
router.route("/").get(getAllSalaries);
router.route("/:id").get(getSalaryById);
router.route("/:id").put(updateSalary);
router.route("/:id").delete(deleteSalary);
router.route("/employee/:id").get(getSalariesByEmployee);

export default router;