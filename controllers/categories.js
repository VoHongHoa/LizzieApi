import moment from "moment/moment.js";
import { createError } from "../error.js";
import Categories from "../models/Categories.js";
import mongoose from "mongoose";

export const getAllCategory = async (req, res, next) => {
  try {
    const categories = await Categories.find({ status: "Active" });
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { categoryCode } = req.params;
    const user = req.user;
    if (typeof categoryCode !== "string") {
      next(createError(400, "Bad request"));
    }
    const categoryExist = await Categories.find({
      categoriesCode: categoryCode,
    });
    if (categoryExist.length < 1) {
      return next(createError(404, "không tồn tại loại sản phẩm"));
    }
    categoryExist[0].categoriesName = req.body.categoriesName;
    categoryExist[0].status = req.body.status;
    categoryExist[0].updatedBy = new mongoose.Types.ObjectId(user._id);
    await categoryExist[0].save();
    res.status(200).json({
      success: true,
      message: "Chỉnh sửa thành công",
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const deleteCategories = async (req, res, next) => {
  try {
    const { categories } = req.body;
    Promise.all(
      categories.map(async (item) => {
        const category = await Categories.findOne({ categoriesCode: item });
        if (!category) {
          return undefined;
        }
        return item;
      })
    ).then(async (result) => {
      const dataDelete = result.filter((item) => item);
      await Categories.deleteMany({ categoriesCode: { $in: dataDelete } });

      return res.status(200).json({
        success: true,
        message: "Xóa dữ liệu thành công",
      });
    });
  } catch (e) {
    next(createError(404, "not found sorry"));
  }
};

export const createCategories = async (req, res, next) => {
  try {
    const user = req.user;
    const category = new Categories({ ...req.body });
    const categoriesExist = await Categories.find({
      categoriesCode: category.categoriesCode,
    });
    if (categoriesExist.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Mã loại sản phẩm đã tồn tại" });
    }
    category.createdBy = new mongoose.Types.ObjectId(user._id);
    await category.save();
    res
      .status(200)
      .json({ success: true, message: `Tạo mới loại sản phẩm thành công` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};
export const searchAction = async (req, res, next) => {
  try {
    const { searchOption, searchModel } = req.body;
    let query = {};
    if (!!searchModel.categoriesName) {
      query.categoriesName = {
        $regex: new RegExp(searchModel.categoriesName, "i"),
      };
    }
    if (!!searchModel.categoriesCode) {
      query.categoriesCode = searchModel.categoriesCode;
    }
    if (!!searchModel.status) {
      query.status = searchModel.status;
    }
    const categories = await Categories.find(query)
      .populate([
        { path: "CreateUserObject", select: "userName" },
        { path: "UpdateUserObject", select: "userName" },
      ])
      .limit(searchOption.limit)
      .skip((searchOption.page - 1) * searchOption.limit);

    const totalDocs = await Categories.find(query).count();
    res.status(200).json({ success: true, categories, totalDocs });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};
