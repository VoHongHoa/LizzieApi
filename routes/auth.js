import express from "express";
import {
  googleAuth,
  signin,
  signup,
  signUpCustomer,
  signinCustomer,
} from "../controllers/auth.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/sign-up", verifyToken, signup);
router.post("/sign-in", signin);

router.post("/customer-sign-up", signUpCustomer);
router.post("/customer-sign-in", signinCustomer);

router.post("/google", googleAuth);

export default router;
