import express from "express";
import {
  createRating,
  getCustomerRating,
  getProductRatingValue,
  getProductRatingReport,
} from "../controllers/rating.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createRating);
router.get("/get-customer-rating/:productCode", verifyToken, getCustomerRating);
router.get("/get-product-rating/:productCode", getProductRatingValue);
router.get("/get-product-rating-report/:productCode", getProductRatingReport);

export default router;
