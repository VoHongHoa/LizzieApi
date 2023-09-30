import express from "express";
import {
  createSaleHeader,
  getAllInvoiceByUser,
  getDetailInvoice,
} from "../controllers/sale.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.get("/detail-invoice/:invoiceHeaderCode", verifyToken, getDetailInvoice);
router.get("/:customerCode", verifyToken, getAllInvoiceByUser);
router.post("/create", verifyToken, createSaleHeader);

export default router;
