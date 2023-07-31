import express from "express";
import {
  createCustomer,
  deleteCustomers,
  searchAction,
  updateCustomer,
} from "../controllers/customer.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createCustomer);
router.post("/search", verifyToken, searchAction);
router.post("/delete", verifyToken, deleteCustomers);
router.patch("/:customerCode", verifyToken, updateCustomer);
export default router;
