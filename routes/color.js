import express from "express";
import {
  createColor,
  deleteColors,
  searchAction,
  updateColor,
  getAllColor,
} from "../controllers/color.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.get("/all", getAllColor);
router.post("/", verifyToken, createColor);
router.post("/search", verifyToken, searchAction);
router.post("/delete", verifyToken, deleteColors);
router.patch("/:colorCode", verifyToken, updateColor);
export default router;
