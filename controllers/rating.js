import mongoose from "mongoose";
import Rating from "../models/Rating.js";
import * as productValidation from "../validation/product.validation.js";

export const createRating = async (req, res, next) => {
  try {
    const user = req.user;
    const { productCode, rating } = req.body;
    if (await productValidation.checkProductIsExist(productCode)) {
      const existRating = await Rating.findOne({
        customerCode: user.customerCode,
        productCode: productCode,
      });
      if (existRating) {
        existRating.rating = rating;
        await existRating.save();
      } else {
        const newRating = new Rating({ ...req.body });
        newRating.createdBy = new mongoose.Types.ObjectId(user._id);
        newRating.customerCode = user.customerCode;
        await newRating.save();
      }
      return res
        .status(200)
        .json({ success: true, message: `Đánh giá thành công` });
    }
    res
      .status(200)
      .json({ success: false, message: `Không tìm thấy sản phẩm` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const getCustomerRating = async (req, res, next) => {
  try {
    const user = req.user;
    const { productCode } = req.params;
    if (await productValidation.checkProductIsExist(productCode)) {
      const rating = await Rating.findOne({
        customerCode: user.customerCode,
        productCode,
      });
      return res.status(200).json({ success: true, rating });
    }
    return res
      .status(200)
      .json({ success: false, message: "Không tìm thấy sản phẩm" });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const getProductRatingValue = async (req, res, next) => {
  try {
    const { productCode } = req.params;
    if (await productValidation.checkProductIsExist(productCode)) {
      const rating = await Rating.aggregate([
        {
          $match: {
            productCode: productCode,
          },
        },
        {
          $group: {
            _id: "$productCode",
            ratingValue: { $avg: "$rating" },
          },
        },
        {
          $project: {
            _id: 0,
            productCode: "$_id",
            ratingValue: 1,
          },
        },
      ]);
      return res.status(200).json({ success: true, rating });
    }
    return res
      .status(200)
      .json({ success: false, message: "Không tìm thấy sản phẩm" });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const getProductRatingReport = async (req, res, next) => {
  try {
    const { productCode } = req.params;
    if (await productValidation.checkProductIsExist(productCode)) {
      const ratingReportQueryResult = await Rating.aggregate([
        {
          $match: {
            productCode: productCode,
          },
        },
        {
          $group: {
            _id: "$rating",
            numOfRating: { $count: {} },
          },
        },
        {
          $project: {
            _id: 0,
            ratingValue: "$_id",
            numOfRating: 1,
          },
        },
      ]).sort({ ratingValue: -1 });

      const sumOfRating = await Rating.find({
        productCode,
      }).countDocuments();

      const ratingReport = ratingReportQueryResult.map((item) => {
        const percentage = parseInt((item.numOfRating / sumOfRating) * 100);
        return {
          ...item,
          percentage,
        };
      });

      return res.status(200).json({ success: true, ratingReport });
    }
    return res
      .status(200)
      .json({ success: false, message: "Không tìm thấy sản phẩm" });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};
