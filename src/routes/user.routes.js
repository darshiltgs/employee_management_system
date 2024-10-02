import { Router } from "express";
import { addUser } from "../controllers/user.controllers.js";

const router = Router();

router.route('/register').post(addUser);

export default router;