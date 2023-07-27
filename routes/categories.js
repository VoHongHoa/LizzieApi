import express from "express";
import {
  createCategories,
  searchAction,
  deleteCategories,
  updateCategory,
} from "../controllers/categories.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createCategories);
router.post("/search", verifyToken, searchAction);
router.post("/delete", verifyToken, deleteCategories);
router.patch("/:categoryCode", verifyToken, updateCategory);
export default router;
