import mongoose from "mongoose";
import Review from "../models/Review.js";
import * as productValidation from "../validation/product.validation.js";

export const updatedReviewByCustomer = async (req, res, next) => {
  try {
    const user = req.user;
    const { reviewId } = req.params;
    const { reviewData } = req.body;

    const existReview = await Review.findOne({
      _id: mongoose.Types.ObjectId(reviewId),
      customerCode: user.customerCode,
    });

    if (!existReview) {
      return res
        .status(200)
        .json({ success: false, message: "Không tìm thấy bình luận" });
    }
    existReview.review = reviewData;
    existReview.updatedBy = user._id;

    await existReview.save();

    return res
      .status(200)
      .json({ success: true, message: `Xóa bình luận thành công` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const removeReviewByCustomer = async (req, res, next) => {
  try {
    const user = req.user;
    const { reviewId } = req.params;

    const review = await Review.findOne({
      _id: reviewId,
      customerCode: user.customerCode,
    });

    if (!review) {
      return res
        .status(200)
        .json({ success: false, message: "Không tìm thấy bình luận" });
    }

    await Review.findByIdAndRemove({
      _id: reviewId,
    });

    return res
      .status(200)
      .json({ success: true, message: `Xóa bình luận thành công` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const createReview = async (req, res, next) => {
  try {
    const user = req.user;
    const { productCode } = req.body;

    if (await productValidation.checkProductIsExist(productCode)) {
      const newReview = new Review({ ...req.body });
      newReview.createdBy = new mongoose.Types.ObjectId(user._id);
      newReview.customerCode = user.customerCode;
      await newReview.save();
      return res
        .status(200)
        .json({ success: true, message: `Thêm mới bình luận thành công` });
    }
    return res
      .status(200)
      .json({ success: false, message: `Sản phẩm không tồn tại` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const getCustomerReview = async (req, res, next) => {
  try {
    const user = req.user;
    const { productCode } = req.params;

    const reviews = await Review.find({
      customerCode: user.customerCode,
      productCode,
    })
      .populate([
        { path: "CustomersObject", select: "customerName customerCode" },
      ])
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, reviews });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const getAllCustomerReview = async (req, res, next) => {
  try {
    const { productCode } = req.params;

    const reviews = await Review.find({
      productCode,
    })
      .populate([
        { path: "CustomersObject", select: "customerName customerCode" },
      ])
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, reviews });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};
