import { Router } from "express";
import { loginUser, registerUser } from "../controller/auth.controller";

const router = Router();

router.route("/sign-up").post(registerUser);
router.route("/sign-in").post(loginUser);

export default router;
