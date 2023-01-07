import express from "express";
import { googleAuth, signin, signup } from "../controllers/auth.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

//Create a user
router.post("/sign-up", verifyToken, signup);
//sign in
router.post("/sign-in", signin);
//google auth
router.post("/google", googleAuth);

export default router;
