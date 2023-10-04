import express from "express";
import {
  addNewWhiteListProduct,
  removeNewWhiteListProduct,
  getAllWhiteListProduct,
} from "../controllers/whileList.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.get("/", verifyToken, getAllWhiteListProduct);
router.post("/", verifyToken, addNewWhiteListProduct);
router.delete("/:whiteListId", verifyToken, removeNewWhiteListProduct);

export default router;
