import express from "express";
import { createCustomer } from "../controllers/customer.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createCustomer);
export default router;
