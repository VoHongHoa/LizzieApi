import { createError } from "../error.js";
import Size from "../models/Size.js";
import mongoose from "mongoose";

export const getAllSize = async (req, res, next) => {
  try {
    const sizes = await Size.find({ status: "Active" });
    return res.status(200).json({
      success: true,
      sizes,
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const updateSize = async (req, res, next) => {
  try {
    const { sizeCode } = req.params;
    const user = req.user;
    if (typeof sizeCode !== "string") {
      next(createError(400, "Bad request"));
    }
    const sizeExist = await Size.find({
      sizeCode: sizeCode,
    });
    if (sizeExist.length < 1) {
      return next(createError(404, "không tồn tại đơn vị tính"));
    }
    sizeExist[0].sizeName = req.body.sizeName;
    sizeExist[0].status = req.body.status;
    sizeExist[0].updatedBy = new mongoose.Types.ObjectId(user._id);
    await sizeExist[0].save();
    res.status(200).json({
      success: true,
      message: "Chỉnh sửa thành công",
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const deleteSizes = async (req, res, next) => {
  try {
    const { sizes } = req.body;
    Promise.all(
      sizes.map(async (item) => {
        const size = await Size.findOne({ sizeCode: item });
        if (!size) {
          return undefined;
        }
        return item;
      })
    ).then(async (result) => {
      const dataDelete = result.filter((item) => item);
      await Size.deleteMany({ sizeCode: { $in: dataDelete } });

      return res.status(200).json({
        success: true,
        message: "Xóa dữ liệu thành công",
      });
    });
  } catch (e) {
    next(createError(404, "not found sorry"));
  }
};

export const createSize = async (req, res, next) => {
  try {
    const user = req.user;
    const size = new Size({ ...req.body });
    const sizesExist = await Size.find({
      sizeCode: size.sizeCode,
    });
    if (sizesExist.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Mã đơn vị tính đã tồn tại" });
    }
    size.createdBy = new mongoose.Types.ObjectId(user._id);
    await size.save();
    return res
      .status(200)
      .json({ success: true, message: `Tạo mới đơn vị tính thành công` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};
export const searchAction = async (req, res, next) => {
  try {
    const { searchOption, searchModel } = req.body;
    let query = {};
    if (!!searchModel.sizeName) {
      query.sizeName = {
        $regex: new RegExp(searchModel.sizeName, "i"),
      };
    }
    if (!!searchModel.sizeCode && searchModel.sizeCode.length > 0) {
      query.sizeCode = searchModel.sizeCode;
    } else {
      query.sizeCode = {
        $regex: new RegExp(searchModel.sizeCode, "i"),
      };
    }
    if (!!searchModel.status) {
      query.status = searchModel.status;
    }
    const sizes = await Size.find(query)
      .populate([
        { path: "CreateUserObject", select: "userName" },
        { path: "UpdateUserObject", select: "userName" },
      ])
      .limit(searchOption.limit)
      .skip((searchOption.page - 1) * searchOption.limit);

    const totalDocs = await Size.find(query).count();
    res.status(200).json({ success: true, sizes, totalDocs });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};
