import express from "express";
import {
  deleteUsers,
  getAllUser,
  getUserÌnfor,
  search,
  updateUser,
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();
//get a user
router.get("/:id", getUserÌnfor);
//update user
router.put("/:id", verifyToken, updateUser);
//getAllUser
router.get("/get-all-users", verifyToken, getAllUser);
router.post("/delete-users", verifyToken, deleteUsers);
router.post("/search", verifyToken, search);
export default router;
