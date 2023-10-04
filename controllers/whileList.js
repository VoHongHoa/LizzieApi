import mongoose from "mongoose";
import WhiteList from "../models/WhiteList.js";
import * as ProductValidation from "../validation/product.validation.js";
import { createError } from "../error.js";
export const addNewWhiteListProduct = async (req, res, next) => {
  try {
    const user = req.user;
    const { productCode } = req.body;
    if (await ProductValidation.checkProductIsExist(productCode)) {
      const whiteList = await WhiteList.findOne({
        customerCode: user.customerCode,
        productCode,
      });
      if (!whiteList) {
        const newWhiteList = new WhiteList({
          customerCode: user.customerCode,
          productCode,
        });
        await newWhiteList.save();
        return res.status(200).json({
          success: true,
          message: "Thêm mới sản phẩm yêu thích thành công",
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Sản phẩm đã được yêu thích",
        });
      }
    }
    return res.status(200).json({
      success: false,
      message: "Không tìm thấy sản phẩm",
    });
  } catch (e) {
    console.log(e);
    next(createError(400, "Sorry not found"));
  }
};

export const removeNewWhiteListProduct = async (req, res, next) => {
  try {
    const user = req.user;
    const { whiteListId } = req.params;
    console.log(whiteListId);
    const whiteList = await WhiteList.findOne({
      _id: whiteListId,
    });

    if (!whiteList) {
      return res.status(200).json({
        success: false,
        message: "Không tìm thấy sản phẩm yêu thích",
      });
    }
    if (whiteList.customerCode !== user.customerCode) {
      return res.status(200).json({
        success: false,
        message: "Bạn không thể xóa sản phẩm yêu thích này",
      });
    }
    await WhiteList.findByIdAndRemove({
      _id: whiteListId,
    });

    return res.status(200).json({
      success: true,
      message: "Xóa sản phẩm yêu thích thành công",
    });
  } catch (e) {
    console.log(e);
    next(createError(400, "Sorry not found"));
  }
};

export const getAllWhiteListProduct = async (req, res, next) => {
  try {
    const user = req.user;
    const whiteListProducts = await WhiteList.find({
      customerCode: user.customerCode,
    }).populate([{ path: "ProductObject" }]);

    return res.status(200).json({
      success: true,
      whiteListProducts,
    });
  } catch (e) {
    console.log(e);
    next(createError(400, "Sorry not found"));
  }
};
