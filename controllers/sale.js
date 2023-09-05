import { createError } from "../error.js";
import mongoose from "mongoose";
import SaleHeader from "../models/SaleHeader.js";
import SaleDetail from "../models/SaleDetail.js";

export const createSaleHeader = async (req, res, next) => {
  try {
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};
