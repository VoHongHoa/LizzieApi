import express from "express";
import {
  createRole,
  deleteRole,
  getAllRole,
  getDataFilter,
  getRoleById,
  searchAction,
  updatePermission,
  updateRole,
} from "../controllers/role.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();
//create a role
router.post("/", verifyToken, createRole);
router.get("/", verifyToken, getAllRole);
router.post("/delete", verifyToken, deleteRole);
router.patch("/:roleId", verifyToken, updateRole);
router.get("/get-data-filter", verifyToken, getDataFilter);
router.post("/search", verifyToken, searchAction);
router.post("/permission/:roleId", verifyToken, updatePermission);
router.get("/get-role/:roleId", verifyToken, getRoleById);
export default router;
