import { Router } from "express";
import { createSalary, deleteSalary, getAllSalaries, getSalariesByEmployee, getSalaryById, updateSalary } from "../controllers/salary.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyToken, createSalary);
router.route("/").get(verifyToken, getAllSalaries);
router.route("/:id").get(verifyToken, getSalaryById);
router.route("/:id").put(verifyToken, updateSalary);
router.route("/:id").delete(verifyToken, deleteSalary);
router.route("/employee/:id").get(verifyToken, getSalariesByEmployee);

export default router;