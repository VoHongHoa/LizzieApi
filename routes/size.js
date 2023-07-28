import express from "express";
import {
  createSize,
  deleteSizes,
  searchAction,
  updateSize,
} from "../controllers/size.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createSize);
router.post("/search", verifyToken, searchAction);
router.post("/delete", verifyToken, deleteSizes);
router.patch("/:sizeCode", verifyToken, updateSize);
export default router;
