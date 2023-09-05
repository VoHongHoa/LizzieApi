import express from "express";
import {
  createProduct,
  searchAction,
  updateProduct,
  deleteProducts,
  getProductByProductCode,
  getAllProduct,
  getProductByCategory,
} from "../controllers/product.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.get("/all", getAllProduct);
router.get("/all/:category", getProductByCategory);
router.post("/", verifyToken, createProduct);
router.post("/search", verifyToken, searchAction);
router.patch("/:productCode", verifyToken, updateProduct);
router.post("/delete", verifyToken, deleteProducts);
router.get("/:productCode", getProductByProductCode);

export default router;
