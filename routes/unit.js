import express from "express";
import {
  createUnit,
  deleteUnits,
  searchAction,
  updateUnit,
} from "../controllers/unit.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createUnit);
router.post("/search", verifyToken, searchAction);
router.post("/delete", verifyToken, deleteUnits);
router.patch("/:unitCode", verifyToken, updateUnit);
export default router;
