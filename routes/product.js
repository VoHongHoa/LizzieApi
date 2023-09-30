import express from "express";
import {
  createProduct,
  searchAction,
  updateProduct,
  deleteProducts,
  getProductByProductCode,
  getAllProduct,
  getProductByCategory,
  getProductBestSaller,
} from "../controllers/product.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.get("/get-product-by-productCode/:productCode", getProductByProductCode);
router.get("/all", getAllProduct);
router.get("/all/:category", getProductByCategory);
router.get("/best-seller", getProductBestSaller);

router.post("/", verifyToken, createProduct);
router.post("/search", verifyToken, searchAction);
router.patch("/:productCode", verifyToken, updateProduct);
router.post("/delete", verifyToken, deleteProducts);

export default router;
