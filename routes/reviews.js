import express from "express";
import {
  createReview,
  getCustomerReview,
  getAllCustomerReview,
  removeReviewByCustomer,
  updatedReviewByCustomer,
} from "../controllers/reviews.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createReview);
router.delete("/:reviewId", verifyToken, removeReviewByCustomer);
router.put("/:reviewId", verifyToken, updatedReviewByCustomer);
router.get("/get-all-rating/:productCode", verifyToken, getAllCustomerReview);
router.get("/get-customer-review/:productCode", verifyToken, getCustomerReview);
export default router;
