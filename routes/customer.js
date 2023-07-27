import express from "express";
import { createCustomer, signUpCustomer } from "../controllers/customer.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createCustomer);
router.post("/sign-up", signUpCustomer);
export default router;
