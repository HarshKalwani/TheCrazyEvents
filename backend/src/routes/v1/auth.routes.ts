import express  from "express";
import { googleLoginController, login, refresh, signUp } from "../../controllers/auth.controller";

const router = express.Router();
router.post("/signUp",signUp)
router.post("/login", login)
router.post("/google-login", googleLoginController);
router.post("/refresh", refresh);

export default router;