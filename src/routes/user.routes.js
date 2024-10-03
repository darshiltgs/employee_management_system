import { Router } from "express";
import { loginUser, logout, registerUser } from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(verifyToken, logout);

export default router;