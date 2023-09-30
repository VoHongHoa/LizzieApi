import { createError } from "../error.js";
import Color from "../models/Color.js";
import mongoose from "mongoose";

export const getAllColor = async (req, res, next) => {
  try {
    const colors = await Color.find({ status: "Active" });
    return res.status(200).json({
      success: true,
      colors,
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const updateColor = async (req, res, next) => {
  try {
    const { colorCode } = req.params;
    const user = req.user;
    if (typeof colorCode !== "string") {
      next(createError(400, "Bad request"));
    }
    const colorExist = await Color.find({
      colorCode: colorCode,
    });
    if (colorExist.length < 1) {
      return next(createError(404, "không tồn tại đơn vị tính"));
    }
    colorExist[0].colorName = req.body.colorName;
    colorExist[0].status = req.body.status;
    colorExist[0].updatedBy = new mongoose.Types.ObjectId(user._id);
    await colorExist[0].save();
    res.status(200).json({
      success: true,
      message: "Chỉnh sửa thành công",
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const deleteColors = async (req, res, next) => {
  try {
    const { colors } = req.body;
    Promise.all(
      colors.map(async (item) => {
        const color = await Color.findOne({ colorCode: item });
        if (!color) {
          return undefined;
        }
        return item;
      })
    ).then(async (result) => {
      const dataDelete = result.filter((item) => item);
      await Color.deleteMany({ colorCode: { $in: dataDelete } });

      return res.status(200).json({
        success: true,
        message: "Xóa dữ liệu thành công",
      });
    });
  } catch (e) {
    next(createError(404, "not found sorry"));
  }
};

export const createColor = async (req, res, next) => {
  try {
    const user = req.user;
    const color = new Color({ ...req.body });
    const colorsExist = await Color.find({
      colorCode: color.colorCode,
    });
    if (colorsExist.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Mã đơn vị tính đã tồn tại" });
    }
    color.createdBy = new mongoose.Types.ObjectId(user._id);
    await color.save();
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
    if (!!searchModel.colorName) {
      query.colorName = {
        $regex: new RegExp(searchModel.colorName, "i"),
      };
    }
    if (!!searchModel.colorCode && searchModel.colorCode.length > 0) {
      query.colorCode = searchModel.colorCode;
    } else {
      query.colorCode = {
        $regex: new RegExp(searchModel.colorCode, "i"),
      };
    }
    if (!!searchModel.status) {
      query.status = searchModel.status;
    }
    const colors = await Color.find(query)
      .populate([
        { path: "CreateUserObject", select: "userName" },
        { path: "UpdateUserObject", select: "userName" },
      ])
      .limit(searchOption.limit)
      .skip((searchOption.page - 1) * searchOption.limit);

    const totalDocs = await Color.find(query).count();
    res.status(200).json({ success: true, colors, totalDocs });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};
